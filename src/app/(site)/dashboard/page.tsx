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
import {
  bengaliNumber,
  formatDate,
  formatTaka,
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/utils";

export const metadata: Metadata = { title: "আমার ড্যাশবোর্ড" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ already?: string }>;
}) {
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
    { label: "এনরোল্ড কোর্স", value: enrollments.length },
    { label: "সম্পন্ন কোর্স", value: completedCourses.length },
    { label: "সার্টিফিকেট", value: completedCourses.length },
    { label: "মোট অর্ডার", value: orders.filter((o) => o.status === "paid").length },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                ড্যাশবোর্ড
              </p>
              <h1 className="section-title mt-1 text-3xl">
                স্বাগতম, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-muted">
                আজ একটু শিখলেই কাল এক ধাপ এগিয়ে থাকবেন।
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/courses" className="btn btn-primary btn-sm">নতুন কোর্স</Link>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-outline btn-sm">অ্যাডমিন</Link>
              )}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line-soft bg-surface p-4">
                <p className="font-display text-2xl font-bold">{bengaliNumber(s.value)}</p>
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
              <h2 className="section-title text-2xl">আমার কোর্স</h2>
              <Link href="/courses" className="text-xs font-semibold text-orange-deep hover:underline">
                আরও কোর্স →
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
                          <span className="text-[0.65rem] text-muted">{percent}%</span>
                        </div>
                        <p className="mt-1 text-[0.65rem] text-muted">
                          {bengaliNumber(completed.length)} / {bengaliNumber(course.lesson_count)} লেসন সম্পন্ন
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                        <Link
                          href={`/learn/${course.slug}${next ? `?lesson=${next.key}` : ""}`}
                          className="btn btn-primary btn-sm"
                        >
                          {percent === 0 ? "শুরু করুন" : percent === 100 ? "রিভিশন করুন" : "চালিয়ে যান"}
                        </Link>
                        {percent === 100 && (
                          <Link href="/verify" className="text-center text-[0.65rem] text-green hover:underline">
                            ✓ সার্টিফিকেট কোড দেখুন
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-line-soft bg-surface p-8 text-center">
                <p className="font-display text-lg font-bold">এখনো কোনো কোর্সে এনরোল করেননি</p>
                <p className="mt-1 text-sm text-muted">
                  একটি কোর্স বেছে নিন — শুরু করার জন্য প্রস্তুত।
                </p>
                <Link href="/courses" className="btn btn-primary btn-sm mt-4">কোর্স দেখুন</Link>
              </div>
            )}
          </section>

          {completedCourses.length > 0 && (
            <section className="rounded-2xl border border-green/30 bg-green/5 p-5">
              <h2 className="font-display text-lg font-bold text-green">আপনার সার্টিফিকেট</h2>
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
                      যাচাই করুন
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="section-title text-2xl">অর্ডার হিস্ট্রি</h2>
            {orders.length ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-line-soft bg-surface">
                <div className="table-wrap">
                  <table className="table-cn">
                    <thead>
                      <tr>
                        <th>অর্ডার</th>
                        <th>পণ্য</th>
                        <th>পরিমাণ</th>
                        <th>স্ট্যাটাস</th>
                        <th>তারিখ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="font-mono text-[0.7rem]">#{o.id}</td>
                          <td className="max-w-[16rem] truncate">{o.title}</td>
                          <td>{formatTaka(o.amount)}</td>
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
                              {orderStatusLabel(o.status)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap text-xs text-muted">
                            {formatDate(o.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">এখনো কোনো অর্ডার নেই।</p>
            )}
          </section>

          {(ebooks.length > 0 || workshops.length > 0) && (
            <section>
              <h2 className="section-title text-2xl">আমার লাইব্রেরি</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ebooks.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line-soft bg-surface p-4">
                    <span className="pill pill-green">ই-বুক</span>
                    <p className="mt-2 text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-[0.68rem] text-muted">
                      {formatDate(o.paid_at || o.created_at)} • {paymentMethodLabel(o.method)}
                    </p>
                  </div>
                ))}
                {workshops.map((o) => (
                  <div key={o.id} className="rounded-xl border border-line-soft bg-surface p-4">
                    <span className="pill pill-live"><span className="live-dot" /> ওয়ার্কশপ</span>
                    <p className="mt-2 text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-[0.68rem] text-muted">
                      রেজিস্ট্রেশন সম্পন্ন • {formatDate(o.paid_at || o.created_at)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[0.68rem] text-muted">
                বিস্তারিত বা ফাইল সংক্রান্ত সহায়তার জন্য{" "}
                <Link href="/contact" className="underline">যোগাযোগ করুন</Link>।
              </p>
            </section>
          )}

          {recommended.length > 0 && (
            <section>
              <h2 className="section-title text-2xl">আপনার জন্য পরবর্তী</h2>
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
              <ProfileForm name={user.name} phone={user.phone || ""} email={user.email} />
            </div>
            <details className="mt-4 border-t border-line-soft pt-3">
              <summary className="cursor-pointer list-none text-xs font-semibold text-orange-deep hover:underline">
                পাসওয়ার্ড পরিবর্তন করুন
              </summary>
              <div className="mt-3">
                <PasswordForm />
              </div>
            </details>
          </div>

          <div className="rounded-2xl border border-line-soft bg-surface-2/70 p-5">
            <p className="font-display text-base font-bold">শেখার টিপস</p>
            <ul className="mt-2 space-y-2 text-xs text-muted">
              <li>প্রতিদিন অন্তত একটি লেসন শেষ করুন — ছোট অভ্যাসই বড় পরিবর্তন আনে।</li>
              <li>লেসনের পর নিজে কোড লিখে দেখুন, শুধু দেখে নয়।</li>
              <li>আটকে গেলে যোগাযোগ করুন — প্রশ্ন করতে দ্বিধা নেই।</li>
            </ul>
          </div>

          {enrollments.length > 0 && (
            <div className="rounded-2xl border border-line-soft bg-surface p-5">
              <p className="font-display text-base font-bold">সাম্প্রতিক কোর্স</p>
              <div className="mt-3 space-y-3">
                {enrollments.slice(0, 2).map(({ course, percent }) => (
                  <div key={course.id}>
                    <div className="flex justify-between text-xs">
                      <span className="truncate pr-2">{course.title}</span>
                      <span className="text-muted">{percent}%</span>
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
