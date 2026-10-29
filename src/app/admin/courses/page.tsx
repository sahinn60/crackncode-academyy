import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/ui";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { adminCourses } from "@/lib/data";
import { togglePublishAction } from "@/lib/admin-actions";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, formatTaka } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "কোর্স ব্যবস্থাপনা", "Course management") };
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const locale = await getLocale();
  const { saved, deleted } = await searchParams;
  const courses = await adminCourses();
  const published = courses.filter((c) => c.published).length;
  const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolled, 0);

  const courseCount = formatNumber(courses.length, locale);
  const publishedCount = formatNumber(published, locale);
  const enrolledCount = formatNumber(totalEnrolled, locale);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {pick(locale, "ক্যাটালগ", "Catalog")}
          </p>
          <h1 className="section-title mt-1 text-3xl">
            {pick(locale, "কোর্স ব্যবস্থাপনা", "Course management")}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {pick(
              locale,
              `${courseCount}টি কোর্স · ${publishedCount}টি প্রকাশিত · ${enrolledCount}টি এনরোলমেন্ট`,
              `${courseCount} courses · ${publishedCount} published · ${enrolledCount} enrollments`
            )}
          </p>
        </div>
        <Link href="/admin/courses/new" className="btn btn-primary btn-sm">
          {pick(locale, "+ নতুন কোর্স", "+ New course")}
        </Link>
      </div>

      {saved && (
        <p className="rounded-xl border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
          {pick(locale, "কোর্সটি সফলভাবে সংরক্ষণ হয়েছে।", "The course was saved successfully.")}
        </p>
      )}
      {deleted && (
        <p className="rounded-xl border border-line-soft bg-surface px-4 py-3 text-sm text-muted">
          {pick(locale, "কোর্সটি মুছে ফেলা হয়েছে।", "The course has been deleted.")}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>{pick(locale, "কোর্স", "Course")}</th>
                <th>{pick(locale, "মূল্য", "Price")}</th>
                <th>{pick(locale, "এনরোল্ড", "Enrolled")}</th>
                <th>{pick(locale, "স্ট্যাটাস", "Status")}</th>
                <th className="text-right">{pick(locale, "অ্যাকশন", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Cover
                        gradient={c.gradient}
                        icon={c.icon}
                        className="hidden h-11 w-16 shrink-0 rounded-lg sm:flex"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/courses/${c.id}`}
                          className="block max-w-[18rem] truncate text-sm font-semibold hover:text-orange-deep"
                        >
                          {c.title}
                        </Link>
                        <p className="max-w-[18rem] truncate text-[0.65rem] text-muted">
                          {c.category} · {c.level} · /{c.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <p className="text-sm font-semibold">{formatTaka(c.price, locale)}</p>
                    <p className="text-[0.62rem] text-muted line-through">
                      {c.original_price > c.price ? formatTaka(c.original_price, locale) : ""}
                    </p>
                  </td>
                  <td className="text-sm">{formatNumber(c.enrolled, locale)}</td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      <span className={`pill ${c.published ? "pill-green" : ""}`}>
                        {c.published
                          ? pick(locale, "প্রকাশিত", "Published")
                          : pick(locale, "ড্রাফট", "Draft")}
                      </span>
                      {c.featured === 1 && (
                        <span className="pill pill-orange">{pick(locale, "ফিচার্ড", "Featured")}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <form action={togglePublishAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-muted hover:bg-surface-2 hover:text-ink"
                        >
                          {c.published
                            ? pick(locale, "আনপাবলিশ", "Unpublish")
                            : pick(locale, "পাবলিশ", "Publish")}
                        </button>
                      </form>
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-orange-deep hover:bg-orange/10"
                      >
                        {pick(locale, "এডিট", "Edit")}
                      </Link>
                      {c.published === 1 && (
                        <Link
                          href={`/courses/${c.slug}`}
                          className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-muted hover:bg-surface-2 hover:text-ink"
                        >
                          {pick(locale, "দেখুন", "View")}
                        </Link>
                      )}
                      <DeleteCourseButton courseId={c.id} title={c.title} locale={locale} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {courses.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            {pick(
              locale,
              "এখনো কোনো কোর্স নেই। প্রথম কোর্সটি তৈরি করুন।",
              "No courses yet. Create your first course."
            )}
          </p>
        )}
      </div>

      <p className="text-[0.7rem] text-muted">
        {pick(
          locale,
          "টিপস: কোর্স আপাতত ড্রাফট হিসেবে রাখুন, কারিকুলাম শেষ করে পাবলিশ করুন। ড্রাফট কোর্স পাবলিক সাইটে দেখা যাবে না।",
          "Tip: keep courses as drafts for now, then publish once the curriculum is complete. Draft courses stay hidden from the public site."
        )}
      </p>
    </div>
  );
}
