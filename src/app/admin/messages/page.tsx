import type { Metadata } from "next";
import { adminMessages } from "@/lib/data";
import { deleteMessageAction } from "@/lib/admin-actions";
import { bengaliNumber, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "মেসেজ" };

export default function AdminMessagesPage() {
  const messages = adminMessages();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">ইনবক্স</p>
        <h1 className="section-title mt-1 text-3xl">যোগাযোগের মেসেজ</h1>
        <p className="mt-1 text-sm text-muted">
          {bengaliNumber(messages.length)}টি বার্তা — কন্টাক্ট ফর্ম থেকে জমা হওয়া।
        </p>
      </div>

      {messages.length ? (
        <div className="space-y-3">
          {messages.map((m) => (
            <article key={m.id} className="rounded-2xl border border-line-soft bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold">
                    {m.subject || "(বিষয়হীন বার্তা)"}
                  </h2>
                  <p className="mt-0.5 text-[0.7rem] text-muted">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}`} className="text-orange-deep hover:underline">
                      {m.email}
                    </a>{" "}
                    · {formatDate(m.created_at)}
                  </p>
                </div>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-md px-2 py-1 text-[0.68rem] font-semibold text-live hover:bg-live/10"
                  >
                    মুছুন
                  </button>
                </form>
              </div>
              <p className="mt-3 whitespace-pre-line border-t border-line-soft pt-3 text-sm leading-relaxed text-muted">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line-soft bg-surface p-10 text-center">
          <p className="font-display text-lg font-bold">ইনবক্স খালি</p>
          <p className="mt-1 text-sm text-muted">কন্টাক্ট পেজ থেকে আসা বার্তা এখানে দেখা যাবে।</p>
        </div>
      )}
    </div>
  );
}
