import type { Metadata } from "next";
import Link from "next/link";
import { CourseForm } from "@/components/admin/course-form";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "নতুন কোর্স", "New course") };
}

export default async function NewCoursePage() {
  const locale = await getLocale();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-xs font-semibold text-muted hover:text-ink">
          {pick(locale, "← কোর্স ব্যবস্থাপনা", "← Course management")}
        </Link>
        <h1 className="section-title mt-2 text-3xl">
          {pick(locale, "নতুন কোর্স তৈরি করুন", "Create a new course")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(
            locale,
            "তথ্য পূরণ করে সংরক্ষণ করুন। ড্রাফট হিসেবে রাখলে পাবলিক সাইটে দেখা যাবে না।",
            "Fill in the details and save. A course kept as a draft stays hidden from the public site."
          )}
        </p>
      </div>
      <CourseForm locale={locale} />
    </div>
  );
}
