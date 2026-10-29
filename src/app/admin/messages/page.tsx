import type { Metadata } from "next";
import { adminMessages } from "@/lib/data";
import { deleteMessageAction } from "@/lib/admin-actions";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "মেসেজ", "Messages") };
}

export default async function AdminMessagesPage() {
  const locale = await getLocale();
  const messages = await adminMessages();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {pick(locale, "ইনবক্স", "Inbox")}
        </p>
        <h1 className="section-title mt-1 text-3xl">
          {pick(locale, "যোগাযোগের মেসেজ", "Contact messages")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(
            locale,
            `${formatNumber(messages.length, locale)}টি বার্তা — কন্টাক্ট ফর্ম থেকে জমা হওয়া।`,
            `${formatNumber(messages.length, locale)} messages — submitted through the contact form.`
          )}
        </p>
      </div>

      {messages.length ? (
        <div className="space-y-3">
          {messages.map((m) => (
            <article key={m.id} className="rounded-2xl border border-line-soft bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold">
                    {m.subject || pick(locale, "(বিষয়হীন বার্তা)", "(No subject)")}
                  </h2>
                  <p className="mt-0.5 text-[0.7rem] text-muted">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}`} className="text-orange-deep hover:underline">
                      {m.email}
                    </a>{" "}
                    · {formatDate(m.created_at, locale)}
                  </p>
                </div>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-md px-2 py-1 text-[0.68rem] font-semibold text-live hover:bg-live/10"
                  >
                    {pick(locale, "মুছুন", "Delete")}
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
          <p className="font-display text-lg font-bold">
            {pick(locale, "ইনবক্স খালি", "Inbox is empty")}
          </p>
          <p className="mt-1 text-sm text-muted">
            {pick(
              locale,
              "কন্টাক্ট পেজ থেকে আসা বার্তা এখানে দেখা যাবে।",
              "Messages sent from the contact page will appear here."
            )}
          </p>
        </div>
      )}
    </div>
  );
}
