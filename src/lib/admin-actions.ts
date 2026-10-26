"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireAdmin } from "./auth";
import { getOrderById } from "./data";
import { fulfillOrder, cancelOrder } from "./orders";
import { slugify } from "./utils";
import type { FormState } from "./actions";
import type { Module } from "./types";

const gradients = new Set([
  "linear-gradient(135deg,#0b1530 0%,#1c2b57 45%,#2a6fbf 100%)",
  "linear-gradient(135deg,#0b1530 0%,#16734a 60%,#3dbe84 100%)",
  "linear-gradient(135deg,#0b1530 0%,#e8641f 60%,#f2c14e 100%)",
  "linear-gradient(135deg,#0b1530 0%,#121f42 50%,#7fb0ea 100%)",
  "linear-gradient(135deg,#121f42 0%,#e8641f 70%,#f2c14e 100%)",
  "linear-gradient(135deg,#0b1530 0%,#16734a 55%,#7fb0ea 100%)",
  "linear-gradient(135deg,#0b1530 0%,#121f42 45%,#e5484d 100%)",
  "linear-gradient(135deg,#121f42 0%,#2a6fbf 55%,#3dbe84 100%)",
  "linear-gradient(135deg,#0b1530 0%,#2a6fbf 60%,#7fb0ea 100%)",
  "linear-gradient(135deg,#0b1530 0%,#f39322 60%,#f2c14e 100%)",
  "linear-gradient(135deg,#0b1530 0%,#1c2b57 50%,#3dbe84 100%)",
  "linear-gradient(135deg,#121f42 0%,#2a6fbf 55%,#f2c14e 100%)",
]);

function parseCurriculum(raw: string): Module[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const modules: Module[] = [];
    for (const m of parsed) {
      if (!m || typeof m.title !== "string" || !m.title.trim()) return null;
      if (!Array.isArray(m.lessons)) return null;
      const lessons = m.lessons
        .filter((l: unknown) => l && typeof (l as { title?: unknown }).title === "string")
        .map((l: { title: string; minutes?: number; summary?: string }) => ({
          title: l.title.trim(),
          minutes: Math.max(1, Number(l.minutes) || 8),
          summary: typeof l.summary === "string" ? l.summary.trim() : "",
        }));
      if (!lessons.length) return null;
      modules.push({ title: m.title.trim(), lessons });
    }
    return modules.length ? modules : null;
  } catch {
    return null;
  }
}

export async function saveCourseAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const level = String(formData.get("level") || "শুরু থেকে").trim();
  const hours = Math.max(1, Number(formData.get("hours")) || 1);
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const originalPrice = Math.max(price, Math.round(Number(formData.get("original_price")) || price));
  const icon = String(formData.get("icon") || "{}").trim().slice(0, 12);
  const gradientRaw = String(formData.get("gradient") || "");
  const gradient = gradients.has(gradientRaw)
    ? gradientRaw
    : "linear-gradient(135deg,#0b1530 0%,#1c2b57 45%,#2a6fbf 100%)";
  const instructorName = String(formData.get("instructor_name") || "").trim();
  const instructorTitle = String(formData.get("instructor_title") || "").trim();
  const instructorBio = String(formData.get("instructor_bio") || "").trim();
  const featured = formData.get("featured") ? 1 : 0;
  const published = formData.get("published") ? 1 : 0;
  const outcomes = String(formData.get("outcomes") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const curriculum = parseCurriculum(String(formData.get("curriculum") || ""));

  if (title.length < 4) return { error: "কোর্সের নাম কমপক্ষে ৪ অক্ষরের হতে হবে।" };
  if (!slug) return { error: "একটি বৈধ স্লাগ দিন (ইংরেজি অক্ষর/সংখ্যা)।" };
  if (subtitle.length < 10) return { error: "সংক্ষিপ্ত বর্ণনা কমপক্ষে ১০ অক্ষরের হতে হবে।" };
  if (description.length < 30) return { error: "কোর্সের বিবরণ কমপক্ষে ৩০ অক্ষরের হতে হবে।" };
  if (!category) return { error: "ক্যাটাগরি লিখুন।" };
  if (!instructorName) return { error: "ইনস্ট্রাক্টরের নাম লিখুন।" };
  if (!outcomes.length) return { error: "কমপক্ষে একটি শেখার ফলাফল (outcome) যোগ করুন।" };
  if (!curriculum) return { error: "কারিকুলামে কমপক্ষে একটি মডিউল ও একটি লেসন থাকতে হবে।" };

  const duplicate = db
    .prepare("SELECT id FROM courses WHERE slug = ? AND id != ?")
    .get(slug, id) as { id: number } | undefined;
  if (duplicate) return { error: "এই স্লাগে আরেকটি কোর্স আছে। ভিন্ন স্লাগ দিন।" };

  const lessonCount = curriculum.reduce((sum, m) => sum + m.lessons.length, 0);
  const values = [
    slug,
    title,
    subtitle,
    description,
    category,
    level,
    hours,
    lessonCount,
    price,
    originalPrice,
    gradient,
    icon,
    featured,
    published,
    instructorName,
    instructorTitle,
    instructorBio,
    JSON.stringify(outcomes),
    JSON.stringify(curriculum),
  ];

  if (id) {
    db.prepare(
      `UPDATE courses SET slug = ?, title = ?, subtitle = ?, description = ?, category = ?,
       level = ?, hours = ?, lesson_count = ?, price = ?, original_price = ?, gradient = ?,
       icon = ?, featured = ?, published = ?, instructor_name = ?, instructor_title = ?,
       instructor_bio = ?, outcomes = ?, curriculum = ? WHERE id = ?`
    ).run(...values, id);
  } else {
    db.prepare(
      `INSERT INTO courses (slug, title, subtitle, description, category, level, hours,
       lesson_count, price, original_price, gradient, icon, featured, published,
       instructor_name, instructor_title, instructor_bio, outcomes, curriculum, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(...values, new Date().toISOString());
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath(`/courses/${slug}`);
  redirect("/admin/courses?saved=1");
}

export async function togglePublishAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  db.prepare("UPDATE courses SET published = CASE published WHEN 1 THEN 0 ELSE 1 END WHERE id = ?").run(id);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const course = db.prepare("SELECT slug FROM courses WHERE id = ?").get(id) as
    | { slug: string }
    | undefined;
  if (!course) redirect("/admin/courses");

  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM lesson_progress WHERE course_id = ?").run(id);
    db.prepare("DELETE FROM enrollments WHERE course_id = ?").run(id);
    db.prepare("DELETE FROM courses WHERE id = ?").run(id);
    const bundles = db.prepare("SELECT id, course_ids FROM bundles").all() as unknown as {
      id: number;
      course_ids: string;
    }[];
    for (const b of bundles) {
      let ids: number[] = [];
      try {
        ids = JSON.parse(b.course_ids);
      } catch {
        continue;
      }
      if (!ids.includes(id)) continue;
      db.prepare("UPDATE bundles SET course_ids = ? WHERE id = ?").run(
        JSON.stringify(ids.filter((x) => x !== id)),
        b.id
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  redirect("/admin/courses?deleted=1");
}

export async function adminMarkPaidAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const order = getOrderById(id);
  if (order) fulfillOrder(order);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function adminCancelOrderAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const order = getOrderById(id);
  if (order) cancelOrder(order);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
