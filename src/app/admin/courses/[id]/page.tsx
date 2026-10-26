import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/course-form";
import { getCourseById } from "@/lib/data";
import { bengaliNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "কোর্স এডিট" };

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(Number(id));
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-xs font-semibold text-muted hover:text-ink">
          ← কোর্স ব্যবস্থাপনা
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="section-title text-3xl">{course.title}</h1>
            <p className="mt-1 text-sm text-muted">
              /{course.slug} · {bengaliNumber(course.lesson_count)}টি লেসন ·{" "}
              {course.published ? "প্রকাশিত" : "ড্রাফট"}
            </p>
          </div>
          <div className="flex gap-2">
            {course.published === 1 && (
              <Link href={`/courses/${course.slug}`} className="btn btn-outline btn-sm">
                পাবলিক পেজ
              </Link>
            )}
            <Link href={`/learn/${course.slug}`} className="btn btn-outline btn-sm">
              প্রিভিউ
            </Link>
          </div>
        </div>
      </div>
      <CourseForm
        course={{
          id: course.id,
          slug: course.slug,
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          category: course.category,
          level: course.level,
          hours: course.hours,
          price: course.price,
          original_price: course.original_price,
          gradient: course.gradient,
          icon: course.icon,
          featured: course.featured,
          published: course.published,
          instructor_name: course.instructor_name,
          instructor_title: course.instructor_title,
          instructor_bio: course.instructor_bio,
          outcomes: course.outcomes,
          curriculum: course.curriculum,
        }}
      />
    </div>
  );
}
