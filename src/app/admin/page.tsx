import type { Metadata } from "next";
import Link from "next/link";
import { adminCourses, adminRecentOrders, adminStats } from "@/lib/data";
import {
  bengaliNumber,
  formatDate,
  formatTaka,
  orderStatusLabel,
} from "@/lib/utils";

export const metadata: Metadata = { title: "ড্যাশবোর্ড" };

export default function AdminHomePage() {
  const stats = adminStats();
  const orders = adminRecentOrders(7);
  const courses = adminCourses();
  const topCourses = [...courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 5);

  const cards = [
    { label: "মোট আয়", value: formatTaka(stats.revenue), note: "সম্পন্ন পেমেন্ট" },
    { label: "স্টুডেন্ট", value: bengaliNumber(stats.students), note: "রেজিস্টার্ড অ্যাকাউন্ট" },
    { label: "এনরোলমেন্ট", value: bengaliNumber(stats.enrollments), note: "সব কোর্স মিলিয়ে" },
    { label: "অপেক্ষমাণ অর্ডার", value: bengaliNumber(stats.pending), note: "যাচাই প্রয়োজন" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">ওভারভিউ</p>
        <h1 className="section-title mt-1 text-3xl">অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="mt-1 text-sm text-muted">
          আজকের তারিখ {formatDate(new Date().toISOString())} — প্ল্যাটফর্মের সবকিছু এক নজরে।
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
            <h2 className="font-display text-base font-bold">সাম্প্রতিক অর্ডার</h2>
            <Link href="/admin/orders" className="text-[0.7rem] font-semibold text-orange-deep hover:underline">
              সব অর্ডার →
            </Link>
          </div>
          {orders.length ? (
            <div className="table-wrap">
              <table className="table-cn">
                <thead>
                  <tr>
                    <th>অর্ডার</th>
                    <th>স্টুডেন্ট</th>
                    <th>পরিমাণ</th>
                    <th>স্ট্যাটাস</th>
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
                      <td className="whitespace-nowrap text-xs">{formatTaka(o.amount)}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted">এখনো কোনো অর্ডার নেই।</p>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-line-soft bg-surface p-4">
            <h2 className="font-display text-base font-bold">দ্রুত কাজ</h2>
            <div className="mt-3 grid gap-2">
              <Link href="/admin/courses/new" className="btn btn-primary btn-sm justify-start">
                নতুন কোর্স তৈরি করুন
              </Link>
              <Link href="/admin/orders?status=pending" className="btn btn-outline btn-sm justify-start">
                অপেক্ষমাণ অর্ডার ({bengaliNumber(stats.pending)})
              </Link>
              <Link href="/admin/messages" className="btn btn-outline btn-sm justify-start">
                মেসেজ ইনবক্স ({bengaliNumber(stats.messages)})
              </Link>
            </div>
            <p className="mt-4 rounded-lg border border-orange/30 bg-orange/10 p-2.5 text-[0.65rem] leading-relaxed text-orange-deep">
              ডেমো পেমেন্ট চালু আছে। লাইভ bKash/Nagad গেটওয়ে সংযুক্ত হলে এই প্যানেলেই ম্যানুয়াল
              যাচাই ও নিশ্চিতকরণ করতে পারবেন।
            </p>
          </section>

          <section className="rounded-2xl border border-line-soft bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold">সেরা কোর্স</h2>
              <Link href="/admin/courses" className="text-[0.7rem] font-semibold text-orange-deep hover:underline">
                সব →
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
                      {c.category} · {c.published ? "প্রকাশিত" : "ড্রাফট"}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.65rem] text-muted">
                    {bengaliNumber(c.enrolled)} জন
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
            <h2 className="font-display text-base font-bold">সাম্প্রতিক মেসেজ</h2>
            <p className="text-[0.7rem] text-muted">
              শিক্ষার্থীদের প্রশ্ন ও যোগাযোগ এখানে জমা হয়।
            </p>
          </div>
          <Link href="/admin/messages" className="btn btn-outline btn-sm">
            ইনবক্স দেখুন ({bengaliNumber(stats.messages)})
          </Link>
        </div>
      </section>
    </div>
  );
}
