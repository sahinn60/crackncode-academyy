import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { completeLessonAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import {
  certificateCode,
  getAllLessons,
  getCompletedLessons,
  getCourseBySlug,
  getEnrollment,
  nextLesson,
  progressPercent,
} from "@/lib/data";
import type { CourseParsed } from "@/lib/types";
import { categoryLabel } from "@/lib/i18n";
import { pick, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatNumber } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course
      ? `${course.title} — ${pick(locale, "লার্নিং", "Learning")}`
      : pick(locale, "লার্নিং", "Learning"),
  };
}

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const { lesson: lessonQuery } = await searchParams;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await requireUser(`/learn/${slug}`);
  const enrollment = await getEnrollment(user.id, course.id);
  const isAdminPreview = !enrollment && user.role === "admin";
  if (!enrollment && !isAdminPreview) redirect(`/courses/${slug}`);

  const completed = enrollment ? await getCompletedLessons(user.id, course.id) : [];
  const completedSet = new Set(completed);
  const allLessons = getAllLessons(course);
  if (!allLessons.length) notFound();

  const fallback = nextLesson(course, completed) ?? allLessons[0];
  const current =
    allLessons.find((l) => l.key === lessonQuery) ?? fallback;
  const currentIndex = allLessons.findIndex((l) => l.key === current.key);
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const percent = enrollment ? progressPercent(course, completed) : 0;
  const isDone = completedSet.has(current.key);
  const redirectTo = next ? `/learn/${slug}?lesson=${next.key}` : `/learn/${slug}?lesson=${current.key}`;
  const certificateReady = enrollment && percent === 100;

  return (
    <div className="container-cn grid gap-6 py-6 lg:grid-cols-[320px_1fr] lg:py-8">
      <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
          <div className="border-b border-line-soft p-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-widest text-orange-deep">
              {categoryLabel(course.category, locale)}
            </p>
            <h1 className="font-display mt-1 text-lg font-bold leading-snug">{course.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="progress-track h-1.5 flex-1">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-[0.65rem] text-muted">{formatNumber(percent, locale)}%</span>
            </div>
            <p className="mt-1.5 text-[0.65rem] text-muted">
              {formatNumber(completed.length, locale)} / {formatNumber(allLessons.length, locale)}{" "}
              {pick(locale, "লেসন সম্পন্ন", "lessons completed")}
            </p>
            {isAdminPreview && (
              <p className="mt-2 rounded-lg bg-mustard/20 px-2 py-1 text-[0.65rem] font-semibold">
                {pick(locale, "অ্যাডমিন প্রিভিউ — প্রোগ্রেস সেভ হবে না", "Admin preview — progress will not be saved")}
              </p>
            )}
          </div>

          <details className="group lg:hidden" open>
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-semibold">
              {pick(locale, "কোর্স কারিকুলাম", "Course curriculum")}{" "}
              <span className="faq-plus text-lg leading-none">+</span>
            </summary>
            <LessonList
              course={course}
              currentKey={current.key}
              completedSet={completedSet}
              locale={locale}
            />
          </details>
          <div className="hidden lg:block">
            <LessonList
              course={course}
              currentKey={current.key}
              completedSet={completedSet}
              locale={locale}
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-line-soft bg-surface p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
            {pick(locale, "সাহায্য দরকার?", "Need help?")}
          </p>
          <p className="mt-1 text-xs text-muted">
            {pick(locale, "লেসন বুঝতে সমস্যা হলে আমাদের মেসেজ করুন।", "If a lesson is unclear, send us a message.")}
          </p>
          <Link href="/contact" className="btn btn-outline btn-sm mt-3 w-full">
            {pick(locale, "যোগাযোগ", "Contact")}
          </Link>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/dashboard" className="hover:text-ink">{pick(locale, "ড্যাশবোর্ড", "Dashboard")}</Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="max-w-[14rem] truncate hover:text-ink">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-ink">{current.moduleTitle}</span>
          </nav>
          <span className="pill">
            {pick(locale, "লেসন", "Lesson")} {formatNumber(currentIndex + 1, locale)} /{" "}
            {formatNumber(allLessons.length, locale)}
          </span>
        </div>

        <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border-2 border-line bg-navy">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,245,245,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,245,245,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[0.65rem] text-cream/60">
            <span className="h-2 w-2 rounded-full bg-live" />
            {slug}.lesson-{currentIndex + 1}
          </div>
          <div className="absolute right-4 top-4 rounded-full border border-cream/25 bg-cream/10 px-2.5 py-1 text-[0.6rem] font-semibold text-cream/70">
            {pick(locale, "ভিডিও লেসন", "Video lesson")}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-cream">
            <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-cream/30 bg-cream/10 backdrop-blur">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
              </svg>
            </span>
            <p className="font-display text-lg font-bold">{current.lesson.title}</p>
            <p className="max-w-md text-[0.7rem] text-cream/60">
              {pick(
                locale,
                "ভিডিও প্লেয়ার এখানে থাকবে — লেসনের লিখিত সারাংশ নিচে পড়ুন।",
                "The video player will appear here — read the written summary of the lesson below."
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line-soft bg-surface p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] text-muted">
            <span className="pill pill-orange">{current.moduleTitle}</span>
            <span>
              {formatNumber(current.lesson.minutes, locale)} {pick(locale, "মিনিট", "min")}
            </span>
            {isDone && <span className="pill pill-green">{pick(locale, "✓ সম্পন্ন", "✓ Completed")}</span>}
          </div>
          <h2 className="section-title mt-3 text-2xl md:text-3xl">{current.lesson.title}</h2>

          <div className="prose-cn mt-4">
            <p>
              {pick(locale, "এই লেসনে আপনি", "In this lesson you will work on")}{" "}
              <strong>{current.lesson.title}</strong>
              {pick(
                locale,
                " নিয়ে কাজ করবেন। মূল ধারণাটি বুঝে নিন, তারপর নিজে ছোট একটি উদাহরণ লিখে অনুশীলন করুন। অনুশীলন ছাড়া কোডিং শেখা হয় না — তাই নিচের ধাপগুলো শেষ করুন।",
                ". Understand the core idea, then practice by writing a small example yourself. Coding can't be learned without practice — so finish the steps below."
              )}
            </p>
            <h2>{pick(locale, "এই লেসনে যা করবেন", "What you'll do in this lesson")}</h2>
            <ul>
              <li>{pick(locale, "ধারণাটি মন দিয়ে বুঝে নিন এবং নিজের ভাষায় নোট করুন।", "Understand the concept carefully and take notes in your own words.")}</li>
              <li>{pick(locale, "উদাহরণ কোডটি নিজে লিখুন — কপি না করে টাইপ করুন।", "Write the example code yourself — type it instead of copying.")}</li>
              <li>{pick(locale, "একটি ছোট পরিবর্তন নিজে যোগ করে দেখান।", "Add a small change of your own and see what happens.")}</li>
              <li>{pick(locale, "কোথাও আটকে গেলে কমিউনিটি বা যোগাযোগ পেজে প্রশ্ন করুন।", "If you get stuck, ask in the community or on the contact page.")}</li>
            </ul>
            <h2>{pick(locale, "অনুশীলন", "Practice")}</h2>
            <p>
              {pick(
                locale,
                "আজকের টপিক থেকে অন্তত দুটি ছোট সমস্যা নিজে সমাধান করুন। ফলাফল ঠিক না হলেও চেষ্টা করুন — এরপর সমাধান মিলিয়ে দেখুন। এই অভ্যাসটাই আপনাকে এগিয়ে নেবে।",
                "Solve at least two small problems from today's topic on your own. Give it a try even if the result isn't right — then compare with the solution. This habit is what will move you forward."
              )}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
            <div className="flex gap-2">
              {prev ? (
                <Link href={`/learn/${slug}?lesson=${prev.key}`} className="btn btn-outline btn-sm">
                  {pick(locale, "← আগের লেসন", "← Previous lesson")}
                </Link>
              ) : (
                <span className="btn btn-outline btn-sm pointer-events-none opacity-40">
                  {pick(locale, "← আগের লেসন", "← Previous lesson")}
                </span>
              )}
              {next ? (
                <Link href={`/learn/${slug}?lesson=${next.key}`} className="btn btn-outline btn-sm">
                  {pick(locale, "পরের লেসন →", "Next lesson →")}
                </Link>
              ) : (
                <span className="btn btn-outline btn-sm pointer-events-none opacity-40">
                  {pick(locale, "পরের লেসন →", "Next lesson →")}
                </span>
              )}
            </div>

            {enrollment && (
              <form action={completeLessonAction}>
                <input type="hidden" name="course_id" value={course.id} />
                <input type="hidden" name="lesson_key" value={current.key} />
                <input type="hidden" name="redirect_to" value={redirectTo} />
                <button
                  type="submit"
                  className={`btn btn-sm ${isDone ? "btn-outline" : "btn-primary"}`}
                >
                  {isDone
                    ? next
                      ? pick(locale, "সম্পন্ন ✓ — পরের লেসন", "Completed ✓ — next lesson")
                      : pick(locale, "সম্পন্ন ✓", "Completed ✓")
                    : pick(locale, "লেসন সম্পন্ন করুন", "Mark lesson complete")}
                </button>
              </form>
            )}
          </div>
        </div>

        {certificateReady && (
          <div className="mt-6 overflow-hidden rounded-2xl border-2 border-green/40 bg-green/5">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-bold text-green">
                  {pick(locale, "অভিনন্দন! কোর্স সম্পন্ন হয়েছে", "Congratulations! Course completed")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {pick(locale, "সার্টিফিকেট কোড:", "Certificate code:")}{" "}
                  <span className="font-mono font-semibold text-ink">
                    {certificateCode(course.id, user.id)}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/verify?code=${certificateCode(course.id, user.id)}`}
                  className="btn btn-primary btn-sm"
                >
                  {pick(locale, "সার্টিফিকেট দেখুন", "View certificate")}
                </Link>
                <Link href="/dashboard" className="btn btn-outline btn-sm">
                  {pick(locale, "ড্যাশবোর্ড", "Dashboard")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function LessonList({
  course,
  currentKey,
  completedSet,
  locale,
}: {
  course: CourseParsed;
  currentKey: string;
  completedSet: Set<string>;
  locale: Locale;
}) {
  return (
    <div className="divide-y divide-line-soft">
      {course.curriculum.map((module, mi) => (
        <div key={module.title} className="p-3">
          <p className="px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-muted">
            {pick(locale, "মডিউল", "Module")} {formatNumber(mi + 1, locale)} — {module.title}
          </p>
          <ul className="mt-1 space-y-0.5">
            {module.lessons.map((lesson, li) => {
              const key = `${mi}-${li}`;
              const done = completedSet.has(key);
              const active = currentKey === key;
              return (
                <li key={key}>
                  <Link
                    href={`/learn/${course.slug}?lesson=${key}`}
                    className={`flex items-start gap-2.5 rounded-lg px-2 py-2 text-[0.78rem] transition-colors ${
                      active
                        ? "bg-orange/15 font-semibold text-ink"
                        : "text-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[0.55rem] font-bold ${
                        done
                          ? "bg-green text-cream"
                          : active
                            ? "bg-orange text-navy"
                            : "border border-line-soft"
                      }`}
                    >
                      {done ? "✓" : li + 1}
                    </span>
                    <span className="flex-1 leading-snug">{lesson.title}</span>
                    <span className="mt-0.5 shrink-0 font-mono text-[0.55rem] opacity-60">
                      {lesson.minutes}m
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
