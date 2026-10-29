import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/ui";
import { listCategories, listCourses } from "@/lib/data";
import { categoryLabel, levelLabel, pick } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "সব কোর্স", "All courses"),
    description: pick(
      locale,
      "প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট, AI, ডিজাইন ও ফ্রিল্যান্সিং কোর্স — সহজ বাংলায়।",
      "Programming, web development, AI, design and freelancing courses — explained simply."
    ),
  };
}

type SearchParams = Promise<{
  q?: string;
  category?: string;
  level?: string;
  sort?: string;
}>;

const levels = ["বিগিনার", "ইন্টারমিডিয়েট", "অ্যাডভান্সড"];

function buildHref(current: Record<string, string>, changes: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...changes };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return `/courses${qs ? `?${qs}` : ""}`;
}

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const locale = await getLocale();
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const category = sp.category || "";
  const level = sp.level || "";
  const sort = sp.sort || "popular";

  const courses = await listCourses({ q, category, level, sort });
  const categories = await listCategories();
  const current: Record<string, string> = { q, category, level, sort };
  const count = formatNumber(courses.length, locale);

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav
            className="flex items-center gap-2 text-xs text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
            <span>/</span>
            <span className="text-ink">{pick(locale, "কোর্স", "Courses")}</span>
          </nav>
          <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="eyebrow">{pick(locale, "কোর্স ক্যাটালগ", "Course catalog")}</span>
              <h1 className="section-title mt-3 text-3xl md:text-5xl">
                {pick(locale, "আপনার পরবর্তী স্কিল বেছে নিন", "Pick your next skill")}
              </h1>
              <p className="mt-3 max-w-2xl text-muted">
                {pick(
                  locale,
                  `${count}টি কোর্স পাওয়া গেছে। সব কোর্সেই লাইফটাইম অ্যাক্সেস, প্রজেক্ট আর সার্টিফিকেট অন্তর্ভুক্ত।`,
                  `${count} courses found. Every course includes lifetime access, projects and a certificate.`
                )}
              </p>
            </div>
            <div className="rounded-xl border border-line-soft bg-surface px-4 py-3 text-sm">
              <span className="font-display text-lg font-bold">{count}</span>{" "}
              <span className="text-muted">{pick(locale, "টি কোর্স", "courses")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-cn py-8 lg:py-10">
        <form method="get" className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={pick(
                locale,
                "কোর্স খুঁজুন — যেমন: React, Python, ফ্রিল্যান্সিং",
                "Search courses — e.g. React, Python, freelancing"
              )}
              className="input pl-9"
              aria-label={pick(locale, "কোর্স সার্চ", "Search courses")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex">
            <select
              name="level"
              defaultValue={level}
              className="input md:w-40"
              aria-label={pick(locale, "লেভেল", "Level")}
            >
              <option value="">{pick(locale, "সব লেভেল", "All levels")}</option>
              {levels.map((l) => (
                <option key={l} value={l}>{levelLabel(l, locale)}</option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={sort}
              className="input md:w-40"
              aria-label={pick(locale, "সাজান", "Sort")}
            >
              <option value="popular">{pick(locale, "জনপ্রিয়", "Popular")}</option>
              <option value="new">{pick(locale, "নতুন", "Newest")}</option>
              <option value="price-low">{pick(locale, "কম দাম", "Price: low to high")}</option>
              <option value="price-high">{pick(locale, "বেশি দাম", "Price: high to low")}</option>
            </select>
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          <button type="submit" className="btn btn-dark">{pick(locale, "ফিল্টার", "Filters")}</button>
        </form>

        <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          <Link
            href={buildHref(current, { category: undefined })}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              !category
                ? "border-navy bg-navy text-cream"
                : "border-line-soft bg-surface text-muted hover:text-ink"
            }`}
          >
            {pick(locale, "সব", "All")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={buildHref(current, { category: c.category })}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                category === c.category
                  ? "border-navy bg-navy text-cream"
                  : "border-line-soft bg-surface text-muted hover:text-ink"
              }`}
            >
              {categoryLabel(c.category, locale)}
              <span className="ml-1.5 opacity-60">{formatNumber(c.count, locale)}</span>
            </Link>
          ))}
        </div>

        {courses.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                subtitle={course.subtitle}
                category={course.category}
                level={course.level}
                hours={course.hours}
                lessonCount={course.lesson_count}
                price={course.price}
                originalPrice={course.original_price}
                gradient={course.gradient}
                icon={course.icon}
                image={course.image}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line-soft bg-surface px-6 py-16 text-center">
            <p className="font-display text-xl font-bold">
              {pick(locale, "কোনো কোর্স পাওয়া যায়নি", "No courses found")}
            </p>
            <p className="mt-2 text-sm text-muted">
              {pick(
                locale,
                "অন্য কীওয়ার্ড দিয়ে খুঁজুন বা ফিল্টার মুছে দেখুন।",
                "Try a different keyword or clear the filters."
              )}
            </p>
            <Link href="/courses" className="btn btn-outline btn-sm mt-5">
              {pick(locale, "সব কোর্স দেখুন", "View all courses")}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
