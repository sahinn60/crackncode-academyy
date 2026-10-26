import type { Metadata } from "next";
import Link from "next/link";
import { CourseForm } from "@/components/admin/course-form";

export const metadata: Metadata = { title: "নতুন কোর্স" };

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-xs font-semibold text-muted hover:text-ink">
          ← কোর্স ব্যবস্থাপনা
        </Link>
        <h1 className="section-title mt-2 text-3xl">নতুন কোর্স তৈরি করুন</h1>
        <p className="mt-1 text-sm text-muted">
          তথ্য পূরণ করে সংরক্ষণ করুন। ড্রাফট হিসেবে রাখলে পাবলিক সাইটে দেখা যাবে না।
        </p>
      </div>
      <CourseForm />
    </div>
  );
}
