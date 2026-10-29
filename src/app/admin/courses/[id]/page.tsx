import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/course-form";
import { getCourseByIdRaw } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "কোর্স এডিট", "Edit course") };
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await getLocale();
  const { id } = await params;
  const course = await getCourseByIdRaw(Number(id));
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-xs font-semibold text-muted hover:text-ink">
          {pick(locale, "← কোর্স ব্যবস্থাপনা", "← Course management")}
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="section-title text-3xl">{course.title}</h1>
            <p className="mt-1 text-sm text-muted">
              /{course.slug} ·{" "}
              {pick(
                locale,
                `${formatNumber(course.lesson_count, locale)}টি লেসন`,
                `${formatNumber(course.lesson_count, locale)} lessons`
              )}{" "}
              ·{" "}
              {course.published
                ? pick(locale, "প্রকাশিত", "Published")
                : pick(locale, "ড্রাফট", "Draft")}
            </p>
          </div>
          <div className="flex gap-2">
            {course.published === 1 && (
              <Link href={`/courses/${course.slug}`} className="btn btn-outline btn-sm">
                {pick(locale, "পাবলিক পেজ", "Public page")}
              </Link>
            )}
            <Link href={`/learn/${course.slug}`} className="btn btn-outline btn-sm">
              {pick(locale, "প্রিভিউ", "Preview")}
            </Link>
          </div>
        </div>
      </div>
      <CourseForm
        locale={locale}
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
