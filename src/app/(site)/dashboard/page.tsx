import type { Metadata } from "next";
import Link from "next/link";
import { Cover, CourseCard, Price } from "@/components/ui";
import { ProfileForm, PasswordForm } from "@/components/forms";
import { requireUser } from "@/lib/auth";
import {
  listCourses,
  listMyEnrollments,
  listMyOrders,
  listMyPurchases,
  nextLesson,
  certificateCode,
} from "@/lib/data";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import {
  formatNumber,
  formatDate,
  formatTaka,
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "আমার ড্যাশবোর্ড", "My dashboard") };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ already?: string }>;
}) {
  const locale = await getLocale();
  const user = await requireUser("/dashboard");
  await searchParams;
  const enrollments = await listMyEnrollments(user.id);
  const orders = await listMyOrders(user.id);
  const ebooks = await listMyPurchases(user.id, "ebook");
  const workshops = await listMyPurchases(user.id, "workshop");
  const completedCourses = enrollments.filter((e) => e.percent === 100);
  const recommended = (await listCourses({ limit: 3 })).filter(
    (c) => !enrollments.some((e) => e.course.id === c.id)
  );

  const stats = [
    { label: pick(locale, "এনরোল্ড কোর্স", "Enrolled courses"), value: enrollments.length },
    { label: pick(locale, "সম্পন্ন কোর্স", "Completed courses"), value: completedCourses.length },
    { label: pick(locale, "সার্টিফিকেট", "Certificates"), value: completedCourses.length },
    {
      label: pick(locale, "মোট অর্ডার", "Total orders"),
      value: orders.filter((o) => o.status === "paid").length,
    },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {pick(locale, "ড্যাশবোর্ড", "Dashboard")}
              </p>
              <h1 className="section-title mt-1 text-3xl">
                {pick(locale, "স্বাগতম", "Welcome")}, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {pick(
                  locale,
                  "আজ একটু শিখলেই কাল এক ধাপ এগিয়ে থাকবেন।",
                  "Learn a little today, and you'll be a step ahead tomorrow."
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/courses" className="btn btn-primary btn-sm">
                {pick(locale, "নতুন কোর্স", "New course")}
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-outline btn-sm">
                  {pick(locale, "অ্যাডমিন", "Admin")}
                </Link>
              )}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line-soft bg-surface p-4">
                <p className="font-display text-2xl font-bold">{formatNumber(s.value, locale)}</p>
                <p className="mt-0.5 text-[0.68rem] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-cn grid gap-8 py-10 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="space-y-10">
          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="section-title text-2xl">{pick(locale, "আমার কোর্স", "My courses")}</h2>
              <Link href="/courses" className="text-xs font-semibold text-orange-deep hover:underline">
                {pick(locale, "আরও কোর্স →", "More courses →")}
              </Link>
            </div>

            {enrollments.length ? (
              <div className="mt-5 space-y-4">
                {enrollments.map(({ course, percent, completed }) => {
                  const next = nextLesson(course, completed);
                  return (
                    <div
                      key={course.id}
                      className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-4 sm:flex-row sm:items-center"
                    >
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-24 w-full shrink-0 rounded-xl object-cover sm:w-36"
                        />
                      ) : (
                        <Cover
                          gradient={course.gradient}
                          icon={course.icon}
                          className="h-24 w-full shrink-0 rounded-xl sm:w-36"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-orange-deep">
                          {course.category}
                        </p>
                        <h3 className="font-display mt-0.5 text-base font-bold leading-snug">
                          {course.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="progress-track h-1.5 flex-1">
                            <div className="progress-fill" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-[0.65rem] text-muted">
                            {formatNumber(percent, locale)}%
                          </span>
                        </div>
                        <p className="mt-1 text-[0.65rem] text-muted">
                          {formatNumber(completed.length, locale)} /{" "}
                          {formatNumber(course.lesson_count, locale)}{" "}
                          {pick(locale, "লেসন সম্পন্ন", "lessons completed")}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                        <Link
                          href={`/learn/${course.slug}${next ? `?lesson=${next.key}` : ""}`}
                          className="btn btn-primary btn-sm"
                        >
                          {percent === 0
                            ? pick(locale, "শুরু করুন", "Start")
                            : percent === 100
                              ? pick(locale, "রিভিশন করুন", "Review")
                              : pick(locale, "চালিয়ে যান", "Continue")}
                        </Link>
                        {percent === 100 && (
                          <Link href="/verify" className="text-center text-[0.65rem] text-green hover:underline">
                            {pick(locale, "✓ সার্টিফিকেট কোড দেখুন", "✓ View certificate code")}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-line-soft bg-surface p-8 text-center">
                <p className="font-display text-lg font-bold">
                  {pick(locale, "এখনো কোনো কোর্সে এনরোল করেননি", "You haven't enrolled in any course yet")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {pick(
                    locale,
                    "একটি কোর্স বেছে নিন — শুরু করার জন্য প্রস্তুত।",
                    "Pick a course — you're ready to start."
                  )}
                </p>
                <Link href="/courses" className="btn btn-primary btn-sm mt-4">
                  {pick(locale, "কোর্স দেখুন", "Browse courses")}
                </Link>
              </div>
            )}
          </section>

          {completedCourses.length > 0 && (
            <section className="rounded-2xl border border-green/30 bg-green/5 p-5">
              <h2 className="font-display text-lg font-bold text-green">
                {pick(locale, "আপনার সার্টিফিকেট", "Your certificates")}
              </h2>
              <div className="mt-3 space-y-2">
                {completedCourses.map(({ course }) => (
                  <div
                    key={course.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-green/20 bg-surface p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{course.title}</p>
                      <p className="font-mono text-[0.68rem] text-muted">
                        {certificateCode(course.id, user.id)}
                      </p>
                    </div>
                    <Link
                      href={`/verify?code=${certificateCode(course.id, user.id)}`}
                      className="btn btn-outline btn-sm"
                    >
                      {pick(locale, "যাচাই করুন", "Verify")}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="section-title text-2xl">{pick(locale, "অর্ডার হিস্ট্রি", "Order history")}</h2>
            {orders.length ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-line-soft bg-surface">
                <div className="table-wrap">
                  <table className="table-cn">
                    <thead>
                      <tr>
                        <th>{pick(locale, "অর্ডার", "Order")}</th>
                        <th>{pick(locale, "পণ্য", "Product")}</th>
                        <th>{pick(locale, "পরিমাণ", "Amount")}</th>
                        <th>{pick(locale, "স্ট্যাটাস", "Status")}</th>
                        <th>{pick(locale, "তারিখ", "Date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="font-mono text-[0.7rem]">#{o.id}</td>
                          <td className="max-w-[16rem] truncate">{o.title}</td>
                          <td>{formatTaka(o.amount, locale)}</td>
                          <td>
                            <span
                              className={`pill ${
                                o.status === "paid"
                                  ? "pill-green"
                                  : o.status === "pending"
                                    ? "pill-orange"
                                    : "pill-live"
                              }`}
                            >
                              {orderStatusLabel(o.status, locale)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap text-xs text-muted">
                            {formatDate(o.created_at, locale)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">
                {pick(locale, "এখনো কোনো অর্ডার নেই।", "No orders yet.")}
              </p>
            )}
          </section>

          {(ebooks.length > 0 || workshops.length > 0) && (
            <section>
              <h2 className="section-title text-2xl">{pick(locale, "আমার লাইব্রেরি", "My library")}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ebooks.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line-soft bg-surface p-4">
                    <span className="pill pill-green">{pick(locale, "ই-বুক", "E-book")}</span>
                    <p className="mt-2 text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-[0.68rem] text-muted">
                      {formatDate(o.paid_at || o.created_at, locale)} •{" "}
                      {paymentMethodLabel(o.method, locale)}
                    </p>
                  </div>
                ))}
                {workshops.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line-soft bg-surface p-4">
                    <span className="pill pill-live">
                      <span className="live-dot" /> {pick(locale, "ওয়ার্কশপ", "Workshop")}
                    </span>
                    <p className="mt-2 text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-[0.68rem] text-muted">
                      {pick(locale, "রেজিস্ট্রেশন সম্পন্ন", "Registration complete")} •{" "}
                      {formatDate(o.paid_at || o.created_at, locale)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[0.68rem] text-muted">
                {pick(
                  locale,
                  "বিস্তারিত বা ফাইল সংক্রান্ত সহায়তার জন্য",
                  "For details or help with files,"
                )}{" "}
                <Link href="/contact" className="underline">
                  {pick(locale, "যোগাযোগ করুন", "contact us")}
                </Link>
                {pick(locale, "।", ".")}
              </p>
            </section>
          )}

          {recommended.length > 0 && (
            <section>
              <h2 className="section-title text-2xl">{pick(locale, "আপনার জন্য পরবর্তী", "Next for you")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((c) => (
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
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line-soft bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-display text-lg font-bold text-cream">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <p className="truncate text-[0.68rem] text-muted">{user.email}</p>
              </div>
            </div>
            <div className="mt-4 border-t border-line-soft pt-4">
              <ProfileForm
                name={user.name}
                phone={user.phone || ""}
                email={user.email}
                locale={locale}
              />
            </div>
            <details className="mt-4 border-t border-line-soft pt-3">
              <summary className="cursor-pointer list-none text-xs font-semibold text-orange-deep hover:underline">
                {pick(locale, "পাসওয়ার্ড পরিবর্তন করুন", "Change password")}
              </summary>
              <div className="mt-3">
                <PasswordForm locale={locale} />
              </div>
            </details>
          </div>

          <div className="rounded-2xl border border-line-soft bg-surface-2/70 p-5">
            <p className="font-display text-base font-bold">{pick(locale, "শেখার টিপস", "Learning tips")}</p>
            <ul className="mt-2 space-y-2 text-xs text-muted">
              <li>
                {pick(
                  locale,
                  "প্রতিদিন অন্তত একটি লেসন শেষ করুন — ছোট অভ্যাসই বড় পরিবর্তন আনে।",
                  "Finish at least one lesson every day — small habits bring big change."
                )}
              </li>
              <li>
                {pick(
                  locale,
                  "লেসনের পর নিজে কোড লিখে দেখুন, শুধু দেখে নয়।",
                  "After each lesson, write the code yourself instead of just watching."
                )}
              </li>
              <li>
                {pick(
                  locale,
                  "আটকে গেলে যোগাযোগ করুন — প্রশ্ন করতে দ্বিধা নেই।",
                  "Stuck? Reach out — never hesitate to ask."
                )}
              </li>
            </ul>
          </div>

          {enrollments.length > 0 && (
            <div className="rounded-2xl border border-line-soft bg-surface p-5">
              <p className="font-display text-base font-bold">{pick(locale, "সাম্প্রতিক কোর্স", "Recent courses")}</p>
              <div className="mt-3 space-y-3">
                {enrollments.slice(0, 2).map(({ course, percent }) => (
                  <div key={course.id}>
                    <div className="flex justify-between text-xs">
                      <span className="truncate pr-2">{course.title}</span>
                      <span className="text-muted">{formatNumber(percent, locale)}%</span>
                    </div>
                    <div className="progress-track mt-1 h-1">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
