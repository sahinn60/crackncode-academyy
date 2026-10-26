import type { Metadata } from "next";
import { adminStudents } from "@/lib/data";
import { bengaliNumber, formatDateShort } from "@/lib/utils";

export const metadata: Metadata = { title: "স্টুডেন্ট" };

export default function AdminStudentsPage() {
  const students = adminStudents();
  const active = students.filter((s) => s.enrollment_count > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">কমিউনিটি</p>
        <h1 className="section-title mt-1 text-3xl">স্টুডেন্ট তালিকা</h1>
        <p className="mt-1 text-sm text-muted">
          {bengaliNumber(students.length)} জন রেজিস্টার্ড · {bengaliNumber(active)} জন অন্তত একটি
          কোর্সে এনরোল্ড
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ফোন</th>
                <th>কোর্স</th>
                <th>পেমেন্ট</th>
                <th>যোগদান</th>
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
                  <td className="text-sm">{bengaliNumber(s.enrollment_count)}</td>
                  <td className="text-sm">{bengaliNumber(s.paid_orders)}</td>
                  <td className="whitespace-nowrap text-[0.68rem] text-muted">
                    {formatDateShort(s.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            এখনো কোনো স্টুডেন্ট রেজিস্টার করেনি।
          </p>
        )}
      </div>

      <p className="text-[0.7rem] text-muted">
        শিক্ষার্থীর পাসওয়ার্ড কখনো দৃশ্যমান হয় না — সংরক্ষিত থাকে scrypt হ্যাশ হিসেবে। পাসওয়ার্ড
        রিসেটের জন্য ভবিষ্যতে ইমেইল সেবা যুক্ত করা যাবে।
      </p>
    </div>
  );
}
