import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="eyebrow">{formatNumber(404, locale)}</span>
      <h1 className="section-title mt-4 text-4xl md:text-6xl">
        {pick(locale, "পেজটা খুঁজে পাচ্ছি না", "We can't find that page")}
      </h1>
      <p className="mt-3 max-w-md text-muted">
        {pick(
          locale,
          "লিংকটা হয়তো পুরোনো, নাহলে পেজটা সরিয়ে ফেলা হয়েছে। নিচের যেকোনো একটি অপশন থেকে শুরু করুন।",
          "The link may be out of date, or the page may have been removed. Start with one of the options below."
        )}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">{pick(locale, "হোমে ফিরুন", "Back to home")}</Link>
        <Link href="/courses" className="btn btn-outline">{pick(locale, "কোর্স দেখুন", "View courses")}</Link>
      </div>
      <p className="mt-10 font-mono text-xs text-muted">{"// 404 page not found"}</p>
    </div>
  );
}
