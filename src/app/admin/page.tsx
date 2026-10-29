import type { Metadata } from "next";
import Link from "next/link";
import { adminCourses, adminRecentOrders, adminStats } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import {
  formatNumber,
  formatDate,
  formatTaka,
  orderStatusLabel,
} from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "ড্যাশবোর্ড", "Dashboard") };
}

export default async function AdminHomePage() {
  const locale = await getLocale();
  const stats = await adminStats();
  const orders = await adminRecentOrders(7);
  const courses = await adminCourses();
  const topCourses = [...courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 5);

  const cards = [
    {
      label: pick(locale, "মোট আয়", "Total revenue"),
      value: formatTaka(stats.revenue, locale),
      note: pick(locale, "সম্পন্ন পেমেন্ট", "Completed payments"),
    },
    {
      label: pick(locale, "স্টুডেন্ট", "Students"),
      value: formatNumber(stats.students, locale),
      note: pick(locale, "রেজিস্টার্ড অ্যাকাউন্ট", "Registered accounts"),
    },
    {
      label: pick(locale, "এনরোলমেন্ট", "Enrollments"),
      value: formatNumber(stats.enrollments, locale),
      note: pick(locale, "সব কোর্স মিলিয়ে", "Across all courses"),
    },
    {
      label: pick(locale, "অপেক্ষমাণ অর্ডার", "Pending orders"),
      value: formatNumber(stats.pending, locale),
      note: pick(locale, "যাচাই প্রয়োজন", "Needs verification"),
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {pick(locale, "ওভারভিউ", "Overview")}
        </p>
        <h1 className="section-title mt-1 text-3xl">
          {pick(locale, "অ্যাডমিন ড্যাশবোর্ড", "Admin dashboard")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(
            locale,
            `আজকের তারিখ ${formatDate(new Date().toISOString(), locale)} — প্ল্যাটফর্মের সবকিছু এক নজরে।`,
            `Today is ${formatDate(new Date().toISOString(), locale)} — everything on the platform at a glance.`
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-4 ${
              i === 0
                ? "border-navy bg-navy text-cream"
                : "border-line-soft bg-surface"
            }`}
          >
            <p className={`text-[0.68rem] ${i === 0 ? "text-cream/70" : "text-muted"}`}>
              {c.label}
            </p>
            <p className="font-display mt-1 text-2xl font-bold">{c.value}</p>
            <p className={`mt-0.5 text-[0.62rem] ${i === 0 ? "text-cream/60" : "text-muted"}`}>
              {c.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
            <h2 className="font-display text-base font-bold">
              {pick(locale, "সাম্প্রতিক অর্ডার", "Recent orders")}
            </h2>
            <Link href="/admin/orders" className="text-[0.7rem] font-semibold text-orange-deep hover:underline">
              {pick(locale, "সব অর্ডার →", "All orders →")}
            </Link>
          </div>
          {orders.length ? (
            <div className="table-wrap">
              <table className="table-cn">
                <thead>
                  <tr>
                    <th>{pick(locale, "অর্ডার", "Order")}</th>
                    <th>{pick(locale, "স্টুডেন্ট", "Student")}</th>
                    <th>{pick(locale, "পরিমাণ", "Amount")}</th>
                    <th>{pick(locale, "স্ট্যাটাস", "Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <span className="font-mono text-[0.7rem]">#{o.id}</span>
                        <p className="max-w-[12rem] truncate text-[0.7rem] text-muted">{o.title}</p>
                      </td>
                      <td>
                        <p className="max-w-[10rem] truncate text-xs font-semibold">{o.student_name}</p>
                        <p className="max-w-[10rem] truncate text-[0.62rem] text-muted">{o.student_email}</p>
                      </td>
                      <td className="whitespace-nowrap text-xs">{formatTaka(o.amount, locale)}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {pick(locale, "এখনো কোনো অর্ডার নেই।", "No orders yet.")}
            </p>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-line-soft bg-surface p-4">
            <h2 className="font-display text-base font-bold">
              {pick(locale, "দ্রুত কাজ", "Quick actions")}
            </h2>
            <div className="mt-3 grid gap-2">
              <Link href="/admin/courses/new" className="btn btn-primary btn-sm justify-start">
                {pick(locale, "নতুন কোর্স তৈরি করুন", "Create a new course")}
              </Link>
              <Link href="/admin/orders?status=pending" className="btn btn-outline btn-sm justify-start">
                {pick(locale, "অপেক্ষমাণ অর্ডার", "Pending orders")} ({formatNumber(stats.pending, locale)})
              </Link>
              <Link href="/admin/messages" className="btn btn-outline btn-sm justify-start">
                {pick(locale, "মেসেজ ইনবক্স", "Message inbox")} ({formatNumber(stats.messages, locale)})
              </Link>
            </div>
            <p className="mt-4 rounded-lg border border-orange/30 bg-orange/10 p-2.5 text-[0.65rem] leading-relaxed text-orange-deep">
              {pick(
                locale,
                "ডেমো পেমেন্ট চালু আছে। লাইভ bKash/Nagad গেটওয়ে সংযুক্ত হলে এই প্যানেলেই ম্যানুয়াল যাচাই ও নিশ্চিতকরণ করতে পারবেন।",
                "Demo payments are enabled. Once a live bKash/Nagad gateway is connected, you can verify and confirm payments manually from this same panel."
              )}
            </p>
          </section>

          <section className="rounded-2xl border border-line-soft bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold">
                {pick(locale, "সেরা কোর্স", "Top courses")}
              </h2>
              <Link href="/admin/courses" className="text-[0.7rem] font-semibold text-orange-deep hover:underline">
                {pick(locale, "সব →", "All →")}
              </Link>
            </div>
            <div className="mt-3 space-y-2.5">
              {topCourses.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/courses/${c.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 hover:bg-surface-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{c.title}</span>
                    <span className="block text-[0.62rem] text-muted">
                      {c.category} ·{" "}
                      {c.published
                        ? pick(locale, "প্রকাশিত", "Published")
                        : pick(locale, "ড্রাফট", "Draft")}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.65rem] text-muted">
                    {pick(
                      locale,
                      `${formatNumber(c.enrolled, locale)} জন`,
                      `${formatNumber(c.enrolled, locale)} students`
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-line-soft bg-surface-2/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold">
              {pick(locale, "সাম্প্রতিক মেসেজ", "Recent messages")}
            </h2>
            <p className="text-[0.7rem] text-muted">
              {pick(
                locale,
                "শিক্ষার্থীদের প্রশ্ন ও যোগাযোগ এখানে জমা হয়।",
                "Questions and messages from students land here."
              )}
            </p>
          </div>
          <Link href="/admin/messages" className="btn btn-outline btn-sm">
            {pick(locale, "ইনবক্স দেখুন", "View inbox")} ({formatNumber(stats.messages, locale)})
          </Link>
        </div>
      </section>
    </div>
  );
}
