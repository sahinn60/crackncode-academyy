"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireAdmin } from "./auth";
import { getOrderById } from "./data";
import { fulfillOrder, cancelOrder } from "./orders";
import { slugify } from "./utils";
import { getLocale } from "./i18n-server";
import { pick } from "./i18n";
import type { FormState } from "./actions";
import type { Module } from "./types";

const gradients = new Set([
  "linear-gradient(135deg,#090E16 0%,#47000E 45%,#ED002B 100%)",
  "linear-gradient(135deg,#47000E 0%,#B80022 55%,#ED002B 100%)",
  "linear-gradient(135deg,#090E16 0%,#B80022 60%,#ED002B 100%)",
  "linear-gradient(135deg,#10131C 0%,#47000E 50%,#ED002B 100%)",
  "linear-gradient(135deg,#47000E 0%,#ED002B 70%,#10131C 100%)",
  "linear-gradient(160deg,#090E16 0%,#47000E 55%,#ED002B 100%)",
  "linear-gradient(135deg,#10131C 0%,#47000E 45%,#B80022 100%)",
  "linear-gradient(150deg,#47000E 0%,#B80022 55%,#ED002B 100%)",
  "linear-gradient(135deg,#090E16 0%,#ED002B 60%,#47000E 100%)",
  "linear-gradient(135deg,#ED002B 0%,#B80022 55%,#090E16 100%)",
  "linear-gradient(135deg,#090E16 0%,#10131C 45%,#ED002B 100%)",
  "linear-gradient(135deg,#47000E 0%,#10131C 55%,#B80022 100%)",
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
  const locale = await getLocale();

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
    : "linear-gradient(135deg,#090E16 0%,#47000E 45%,#ED002B 100%)";
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

  if (title.length < 4)
    return {
      error: pick(
        locale,
        "কোর্সের নাম কমপক্ষে ৪ অক্ষরের হতে হবে।",
        "Course title must be at least 4 characters long."
      ),
    };
  if (!slug)
    return {
      error: pick(
        locale,
        "একটি বৈধ স্লাগ দিন (ইংরেজি অক্ষর/সংখ্যা)।",
        "Please provide a valid slug (English letters/numbers)."
      ),
    };
  if (subtitle.length < 10)
    return {
      error: pick(
        locale,
        "সংক্ষিপ্ত বর্ণনা কমপক্ষে ১০ অক্ষরের হতে হবে।",
        "Short description must be at least 10 characters long."
      ),
    };
  if (description.length < 30)
    return {
      error: pick(
        locale,
        "কোর্সের বিবরণ কমপক্ষে ৩০ অক্ষরের হতে হবে।",
        "Course description must be at least 30 characters long."
      ),
    };
  if (!category) return { error: pick(locale, "ক্যাটাগরি লিখুন।", "Please enter a category.") };
  if (!instructorName)
    return {
      error: pick(locale, "ইনস্ট্রাক্টরের নাম লিখুন।", "Please enter the instructor's name."),
    };
  if (!outcomes.length)
    return {
      error: pick(
        locale,
        "কমপক্ষে একটি শেখার ফলাফল (outcome) যোগ করুন।",
        "Add at least one learning outcome."
      ),
    };
  if (!curriculum)
    return {
      error: pick(
        locale,
        "কারিকুলামে কমপক্ষে একটি মডিউল ও একটি লেসন থাকতে হবে।",
        "The curriculum must include at least one module and one lesson."
      ),
    };

  const duplicate = await db
    .prepare("SELECT id FROM courses WHERE slug = ? AND id != ?")
    .get<{ id: number }>(slug, id);
  if (duplicate)
    return {
      error: pick(
        locale,
        "এই স্লাগে আরেকটি কোর্স আছে। ভিন্ন স্লাগ দিন।",
        "Another course already uses this slug. Please choose a different one."
      ),
    };

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
    await db
      .prepare(
        `UPDATE courses SET slug = ?, title = ?, subtitle = ?, description = ?, category = ?,
       level = ?, hours = ?, lesson_count = ?, price = ?, original_price = ?, gradient = ?,
       icon = ?, featured = ?, published = ?, instructor_name = ?, instructor_title = ?,
       instructor_bio = ?, outcomes = ?, curriculum = ? WHERE id = ?`
      )
      .run(...values, id);
  } else {
    await db
      .prepare(
        `INSERT INTO courses (slug, title, subtitle, description, category, level, hours,
       lesson_count, price, original_price, gradient, icon, featured, published,
       instructor_name, instructor_title, instructor_bio, outcomes, curriculum, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(...values, new Date().toISOString());
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
  await db
    .prepare("UPDATE courses SET published = CASE published WHEN 1 THEN 0 ELSE 1 END WHERE id = ?")
    .run(id);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const course = await db
    .prepare("SELECT slug FROM courses WHERE id = ?")
    .get<{ slug: string }>(id);
  if (!course) redirect("/admin/courses");

  await db.prepare("DELETE FROM lesson_progress WHERE course_id = ?").run(id);
  await db.prepare("DELETE FROM enrollments WHERE course_id = ?").run(id);
  await db.prepare("DELETE FROM courses WHERE id = ?").run(id);
  const bundles = await db
    .prepare("SELECT id, course_ids FROM bundles")
    .all<{ id: number; course_ids: string }>();
  for (const b of bundles) {
    let ids: number[] = [];
    try {
      ids = JSON.parse(b.course_ids);
    } catch {
      continue;
    }
    if (!ids.includes(id)) continue;
    await db
      .prepare("UPDATE bundles SET course_ids = ? WHERE id = ?")
      .run(JSON.stringify(ids.filter((x) => x !== id)), b.id);
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/");
  redirect("/admin/courses?deleted=1");
}

export async function adminMarkPaidAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const order = await getOrderById(id);
  if (order) await fulfillOrder(order);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function adminCancelOrderAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const order = await getOrderById(id);
  if (order) await cancelOrder(order);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.prepare("DELETE FROM messages WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
