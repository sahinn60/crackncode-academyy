import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/ui";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { adminCourses } from "@/lib/data";
import { togglePublishAction } from "@/lib/admin-actions";
import { bengaliNumber, formatTaka } from "@/lib/utils";

export const metadata: Metadata = { title: "কোর্স ব্যবস্থাপনা" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const courses = adminCourses();
  const published = courses.filter((c) => c.published).length;
  const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolled, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">ক্যাটালগ</p>
          <h1 className="section-title mt-1 text-3xl">কোর্স ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-muted">
            {bengaliNumber(courses.length)}টি কোর্স · {bengaliNumber(published)}টি প্রকাশিত ·{" "}
            {bengaliNumber(totalEnrolled)}টি এনরোলমেন্ট
          </p>
        </div>
        <Link href="/admin/courses/new" className="btn btn-primary btn-sm">
          + নতুন কোর্স
        </Link>
      </div>

      {saved && (
        <p className="rounded-xl border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
          কোর্সটি সফলভাবে সংরক্ষণ হয়েছে।
        </p>
      )}
      {deleted && (
        <p className="rounded-xl border border-line-soft bg-surface px-4 py-3 text-sm text-muted">
          কোর্সটি মুছে ফেলা হয়েছে।
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>কোর্স</th>
                <th>মূল্য</th>
                <th>এনরোল্ড</th>
                <th>স্ট্যাটাস</th>
                <th className="text-right">অ্যাকশন</th>
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
                    <p className="text-sm font-semibold">{formatTaka(c.price)}</p>
                    <p className="text-[0.62rem] text-muted line-through">
                      {c.original_price > c.price ? formatTaka(c.original_price) : ""}
                    </p>
                  </td>
                  <td className="text-sm">{bengaliNumber(c.enrolled)}</td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      <span className={`pill ${c.published ? "pill-green" : ""}`}>
                        {c.published ? "প্রকাশিত" : "ড্রাফট"}
                      </span>
                      {c.featured === 1 && <span className="pill pill-orange">ফিচার্ড</span>}
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
                          {c.published ? "আনপাবলিশ" : "পাবলিশ"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-orange-deep hover:bg-orange/10"
                      >
                        এডিট
                      </Link>
                      {c.published === 1 && (
                        <Link
                          href={`/courses/${c.slug}`}
                          className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-muted hover:bg-surface-2 hover:text-ink"
                        >
                          দেখুন
                        </Link>
                      )}
                      <DeleteCourseButton courseId={c.id} title={c.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {courses.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            এখনো কোনো কোর্স নেই। প্রথম কোর্সটি তৈরি করুন।
          </p>
        )}
      </div>

      <p className="text-[0.7rem] text-muted">
        টিপস: কোর্স আপাতত ড্রাফট হিসেবে রাখুন, কারিকুলাম শেষ করে পাবলিশ করুন। ড্রাফট কোর্স
        পাবলিক সাইটে দেখা যাবে না।
      </p>
    </div>
  );
}
