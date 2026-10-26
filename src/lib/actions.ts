"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { clearSession, getCurrentUser, safeNext, setSession } from "./auth";
import { verifyPassword, hashPassword } from "./password";
import { getEnrollment, getOrderById } from "./data";
import { fulfillOrder, cancelOrder } from "./orders";
import { getCheckoutProduct, productHref } from "./products";

export type FormState = { error?: string; success?: string } | null;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(String(formData.get("next") || ""));

  if (name.length < 2) return { error: "আপনার পুরো নাম লিখুন।" };
  if (!emailRe.test(email)) return { error: "সঠিক ইমেইল ঠিকানা দিন।" };
  if (password.length < 8) return { error: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" };

  const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return { error: "এই ইমেইলে একটি অ্যাকাউন্ট আছে। লগইন করুন।" };

  const result = await db
    .prepare(
      "INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, 'student', ?)"
    )
    .run(name, email, hashPassword(password), new Date().toISOString());

  await setSession(Number(result.lastInsertRowid));
  redirect(next);
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  const user = await db
    .prepare("SELECT id, password_hash, role FROM users WHERE email = ?")
    .get<{ id: number; password_hash: string; role: string }>(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" };
  }

  await setSession(user.id);
  if (next) redirect(safeNext(next));
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function placeOrderAction(formData: FormData) {
  const user = await getCurrentUser();
  const type = String(formData.get("product_type") || "");
  const id = Number(formData.get("product_id"));
  const method = String(formData.get("method") || "bkash");

  const product = await getCheckoutProduct(type, id);
  if (!product) redirect("/courses");
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/checkout/${product.type}/${product.id}`)}`);
  }
  if (!["bkash", "nagad", "card"].includes(method)) {
    redirect(`/checkout/${product.type}/${product.id}?error=method`);
  }

  if (type === "course") {
    const existing = await getEnrollment(user.id, product.id);
    if (existing) redirect(`/learn/${product.slug}`);
  }

  const now = new Date().toISOString();
  const txn = `CN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 9000 + 1000)}`;

  const result = await db
    .prepare(
      `INSERT INTO orders (user_id, product_type, product_id, title, amount, method, status, txn_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(user.id, product.type, product.id, product.title, product.amount, method, "pending", txn, now);

  const orderId = Number(result.lastInsertRowid);

  if (product.amount === 0) {
    const order = await getOrderById(orderId);
    if (order) await fulfillOrder(order);
    redirect(`/payment/success?order=${orderId}`);
  }

  redirect(`/payment/${orderId}`);
}

export async function confirmPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const orderId = Number(formData.get("order_id"));
  const order = await getOrderById(orderId);
  if (!order || order.user_id !== user.id) redirect("/dashboard");
  await fulfillOrder(order);
  revalidatePath("/dashboard");
  redirect(`/payment/success?order=${order.id}`);
}

export async function cancelPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const orderId = Number(formData.get("order_id"));
  const order = await getOrderById(orderId);
  if (!order || order.user_id !== user.id) redirect("/dashboard");
  await cancelOrder(order);
  const product = await getCheckoutProduct(order.product_type, order.product_id);
  redirect(product ? productHref(product.type, product.slug) : "/courses");
}

export async function completeLessonAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const courseId = Number(formData.get("course_id"));
  const lessonKey = String(formData.get("lesson_key") || "");
  const redirectTo = String(formData.get("redirect_to") || "");

  const enrollment = await getEnrollment(user.id, courseId);
  if (!enrollment) redirect("/dashboard");

  await db
    .prepare(
      "INSERT OR IGNORE INTO lesson_progress (user_id, course_id, lesson_key, completed_at) VALUES (?, ?, ?, ?)"
    )
    .run(user.id, courseId, lessonKey, new Date().toISOString());

  revalidatePath("/dashboard");
  redirect(redirectTo.startsWith("/learn/") ? redirectTo : "/dashboard");
}

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  if (!emailRe.test(email)) return { error: "সঠিক ইমেইল ঠিকানা দিন।" };
  if (body.length < 10) return { error: "বার্তাটি অন্তত ১০ অক্ষরের হতে হবে।" };

  await db
    .prepare(
      "INSERT INTO messages (name, email, subject, body, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .run(name, email, subject, body, new Date().toISOString());

  return { success: "ধন্যবাদ! আপনার বার্তা পৌঁছেছে। আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।" };
}

export async function subscribeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!emailRe.test(email)) return { error: "সঠিক ইমেইল ঠিকানা দিন।" };
  await db
    .prepare("INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)")
    .run(email, new Date().toISOString());
  return { success: "সাবস্ক্রাইব সম্পন্ন! নতুন কোর্সের খবর পাবেন।" };
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "আবার লগইন করুন।" };
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (name.length < 2) return { error: "আপনার নাম লিখুন।" };
  await db
    .prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?")
    .run(name, phone || null, user.id);
  revalidatePath("/dashboard");
  return { success: "প্রোফাইল আপডেট হয়েছে।" };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "আবার লগইন করুন।" };
  const current = String(formData.get("current") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (!current) return { error: "বর্তমান পাসওয়ার্ড দিন।" };
  if (password.length < 8) return { error: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" };
  if (password !== confirm) return { error: "নতুন পাসওয়ার্ড দুটি মিলছে না।" };
  if (password === current) return { error: "নতুন পাসওয়ার্ড আগেরটির মতোই — ভিন্ন পাসওয়ার্ড দিন।" };
  const row = await db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get<{ password_hash: string }>(user.id);
  if (!row || !verifyPassword(current, row.password_hash)) {
    return { error: "বর্তমান পাসওয়ার্ড সঠিক নয়।" };
  }
  await db
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(password), user.id);
  return { success: "পাসওয়ার্ড পরিবর্তন হয়েছে। পরবর্তী লগইনে নতুন পাসওয়ার্ড ব্যবহার করুন।" };
}
