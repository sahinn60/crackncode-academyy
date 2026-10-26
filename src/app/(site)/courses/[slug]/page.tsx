import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover, CourseCard, Price } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getCompletedLessons, getCourseBySlug, getEnrollment, listCourses, nextLesson, progressPercent } from "@/lib/data";
import { bengaliNumber, discountPercent, formatDate, formatTaka } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "কোর্স পাওয়া যায়নি" };
  return { title: course.title, description: course.subtitle };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!course.published && user?.role !== "admin") notFound();
  const enrollment = user ? getEnrollment(user.id, course.id) : undefined;
  const completed = enrollment && user ? getCompletedLessons(user.id, course.id) : [];
  const percent = enrollment ? progressPercent(course, completed) : 0;
  const next = nextLesson(course, completed);
  const related = listCourses({ category: course.category, limit: 4 }).filter(
    (c) => c.id !== course.id
  ).slice(0, 3);
  const totalMinutes = course.curriculum.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.minutes, 0),
    0
  );
  const off = discountPercent(course.price, course.original_price);

  return (
    <>
      <section className="border-b border-line bg-surface-2/40">
        <div className="container-cn py-8 lg:py-10">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-ink">কোর্স</Link>
            <span>/</span>
            <span className="text-ink">{course.title}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="pill pill-orange">{course.category}</span>
            <span className="pill">{course.level}</span>
            <span className="pill">লেসন {bengaliNumber(course.lesson_count)}টি</span>
            <span className="pill">{course.hours} ঘণ্টা</span>
          </div>
          <h1 className="section-title mt-4 max-w-4xl text-3xl md:text-[3rem]">{course.title}</h1>
          <p className="mt-3 max-w-3xl text-muted">{course.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>
              ইনস্ট্রাক্টর: <strong className="font-semibold text-ink">{course.instructor_name}</strong>
            </span>
            <span>•</span>
            <span>আপডেট: {formatDate(course.created_at)}</span>
            <span>•</span>
            <span>প্রজেক্ট ও সার্টিফিকেট অন্তর্ভুক্ত</span>
          </div>
        </div>
      </section>

      <div className="container-cn grid gap-10 py-10 lg:grid-cols-[1.65fr_0.9fr] lg:py-14">
        <div className="min-w-0">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="h-52 w-full rounded-2xl border border-line-soft object-cover sm:h-72"
            />
          ) : (
            <Cover
              gradient={course.gradient}
              icon={course.icon}
              label={course.level}
              className="h-52 w-full rounded-2xl border border-line-soft sm:h-72"
            />
          )}

          <section className="mt-10">
            <h2 className="section-title text-2xl">কোর্স সম্পর্কে</h2>
            <div className="mt-4 space-y-4 text-[0.98rem] leading-relaxed text-muted">
              {course.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-line-soft bg-surface p-6">
            <h2 className="section-title text-2xl">যা শিখবেন</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green/15 text-[0.65rem] font-bold text-green">
                    ✓
                  </span>
                  {outcome}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10" id="curriculum">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="section-title text-2xl">কোর্স কারিকুলাম</h2>
              <p className="text-xs text-muted">
                {bengaliNumber(course.curriculum.length)}টি মডিউল •{" "}
                {bengaliNumber(course.lesson_count)}টি লেসন •{" "}
                {bengaliNumber(Math.round(totalMinutes / 60))} ঘণ্টা
              </p>
            </div>
            <div className="mt-5 divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface">
              {course.curriculum.map((module, mi) => {
                const moduleMinutes = module.lessons.reduce((s, l) => s + l.minutes, 0);
                return (
                  <details key={module.title} className="faq-item" open={mi === 0}>
                    <summary className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface-2 font-mono text-xs font-bold">
                          {String(mi + 1).padStart(2, "0")}
                        </span>
                        <span className="font-semibold">{module.title}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3 text-[0.7rem] text-muted">
                        {module.lessons.length} লেসন • {moduleMinutes} মিনিট
                        <span className="faq-plus text-lg leading-none">+</span>
                      </span>
                    </summary>
                    <ul className="border-t border-line-soft">
                      {module.lessons.map((lesson, li) => (
                        <li
                          key={lesson.title}
                          className="flex items-center justify-between gap-4 border-b border-line-soft px-5 py-3 text-sm last:border-0"
                        >
                          <span className="flex items-center gap-3 text-muted">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path d="M8 5v14l11-7-11-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                            <span className="text-ink">{lesson.title}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[0.68rem] text-muted">
                            {lesson.minutes} মিনিট
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-line-soft bg-surface p-6">
            <h2 className="section-title text-2xl">ইনস্ট্রাক্টর</h2>
            <div className="mt-5 flex flex-wrap items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl font-bold text-cream">
                {course.instructor_name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold">{course.instructor_name}</p>
                <p className="text-xs font-semibold text-orange-deep">{course.instructor_title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{course.instructor_bio}</p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="section-title text-2xl">কোর্সটি কাদের জন্য</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {[
                "যারা একদম শুরু থেকে স্কিল শিখে ক্যারিয়ার গড়তে চান",
                "যারা ভিডিও দেখে নয়, নিজে প্রজেক্ট করে শিখতে চান",
                "যারা বাংলায় সহজ ব্যাখ্যা আর নিয়মিত সাপোর্ট খুঁজছেন",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border-2 border-line bg-surface p-6 shadow-[6px_6px_0_var(--shadow-color)]">
            <Price price={course.price} original={course.original_price} size="lg" />
            {off > 0 && (
              <p className="mt-1 text-xs font-semibold text-live">
                সীমিত সময়ের ছাড় — {off}% সেভ করুন
              </p>
            )}

            {enrollment && next ? (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>আপনার প্রোগ্রেস</span>
                  <span>{percent}%</span>
                </div>
                <div className="progress-track mt-2">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <Link
                  href={`/learn/${course.slug}?lesson=${next.key}`}
                  className="btn btn-primary mt-4 w-full"
                >
                  শেখা চালিয়ে যান →
                </Link>
                <p className="mt-2 text-center text-[0.7rem] text-muted">
                  {bengaliNumber(completed.length)} / {bengaliNumber(course.lesson_count)} লেসন সম্পন্ন
                </p>
              </div>
            ) : (
              <Link
                href={`/checkout/course/${course.id}`}
                className="btn btn-primary mt-5 w-full btn-lg"
              >
                এখনই এনরোল করুন
              </Link>
            )}

            <ul className="mt-5 space-y-2.5 border-t border-line-soft pt-5 text-sm">
              {[
                "লাইফটাইম অ্যাক্সেস ও আপডেট",
                `${bengaliNumber(course.lesson_count)}টি লেসন, ${course.hours} ঘণ্টা কনটেন্ট`,
                "প্রজেক্ট ও অনুশীলন",
                "যাচাইযোগ্য সার্টিফিকেট",
                "বাংলায় কমিউনিটি সাপোর্ট",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted">
                  <span className="mt-0.5 text-green">✓</span> {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-surface-2 p-3 text-center">
              <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted">
                পেমেন্ট মাধ্যম
              </p>
              <p className="mt-1 text-xs font-bold">bKash • Nagad • কার্ড</p>
            </div>
          </div>

          <p className="mt-4 px-2 text-center text-[0.7rem] leading-relaxed text-muted">
            এনরোল করলে আপনি আমাদের{" "}
            <Link href="/refund" className="underline">রিফান্ড নীতি</Link> মেনে নিচ্ছেন।
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface-2/40 py-12">
          <div className="container-cn">
            <div className="flex items-end justify-between gap-4">
              <h2 className="section-title text-2xl">সম্পর্কিত কোর্স</h2>
              <Link href="/courses" className="btn btn-outline btn-sm">সব কোর্স</Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard
                  key={c.id}
                  slug={c.slug}
                  title={c.title}
                  subtitle={c.subtitle}
                  category={c.category}
                  level={c.level}
                  hours={c.hours}
                  lessonCount={c.lesson_count}
                  price={c.price}
                  originalPrice={c.original_price}
                  gradient={c.gradient}
                  icon={c.icon}
                  image={c.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="sticky bottom-0 border-t border-line bg-page/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold">{formatTaka(course.price)}</p>
            <p className="text-[0.65rem] text-muted line-through">{formatTaka(course.original_price)}</p>
          </div>
          {enrollment && next ? (
            <Link href={`/learn/${course.slug}?lesson=${next.key}`} className="btn btn-primary flex-1">
              শেখা চালিয়ে যান
            </Link>
          ) : (
            <Link href={`/checkout/course/${course.id}`} className="btn btn-primary flex-1">
              এখনই এনরোল করুন
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
