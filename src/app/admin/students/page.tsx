import type { Metadata } from "next";
import { adminStudents } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, formatDateShort } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "স্টুডেন্ট", "Students") };
}

export default async function AdminStudentsPage() {
  const locale = await getLocale();
  const students = await adminStudents();
  const active = students.filter((s) => s.enrollment_count > 0).length;
  const studentCount = formatNumber(students.length, locale);
  const activeCount = formatNumber(active, locale);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {pick(locale, "কমিউনিটি", "Community")}
        </p>
        <h1 className="section-title mt-1 text-3xl">
          {pick(locale, "স্টুডেন্ট তালিকা", "Student list")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(
            locale,
            `${studentCount} জন রেজিস্টার্ড · ${activeCount} জন অন্তত একটি কোর্সে এনরোল্ড`,
            `${studentCount} registered · ${activeCount} enrolled in at least one course`
          )}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>{pick(locale, "নাম", "Name")}</th>
                <th>{pick(locale, "ফোন", "Phone")}</th>
                <th>{pick(locale, "কোর্স", "Courses")}</th>
                <th>{pick(locale, "পেমেন্ট", "Payments")}</th>
                <th>{pick(locale, "যোগদান", "Joined")}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy font-mono text-[0.7rem] font-bold text-cream">
                        {s.name.trim().charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-[14rem] truncate text-sm font-semibold">{s.name}</p>
                        <p className="max-w-[14rem] truncate text-[0.65rem] text-muted">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-xs text-muted">{s.phone || "—"}</td>
                  <td className="text-sm">{formatNumber(s.enrollment_count, locale)}</td>
                  <td className="text-sm">{formatNumber(s.paid_orders, locale)}</td>
                  <td className="whitespace-nowrap text-[0.68rem] text-muted">
                    {formatDateShort(s.created_at, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            {pick(locale, "এখনো কোনো স্টুডেন্ট রেজিস্টার করেনি।", "No students have registered yet.")}
          </p>
        )}
      </div>

      <p className="text-[0.7rem] text-muted">
        {pick(
          locale,
          "শিক্ষার্থীর পাসওয়ার্ড কখনো দৃশ্যমান হয় না — সংরক্ষিত থাকে scrypt হ্যাশ হিসেবে। পাসওয়ার্ড রিসেটের জন্য ভবিষ্যতে ইমেইল সেবা যুক্ত করা যাবে।",
          "Student passwords are never visible — they are stored as scrypt hashes. An email service can be added later for password resets."
        )}
      </p>
    </div>
  );
}
