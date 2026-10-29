import Link from "next/link";
import { Logo } from "@/components/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="auth-panel relative hidden overflow-hidden p-10 lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,245,245,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,245,245,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative text-cream">
          <Logo />
        </div>

        <div className="relative mt-auto mb-auto max-w-md py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-3 py-1 text-xs font-semibold text-cream/80">
            <span className="live-dot" /> {pick(locale, "নতুন ব্যাচ চলছে", "New batch in progress")}
          </span>
          <h1 className="section-title mt-6 text-4xl leading-tight text-cream xl:text-5xl">
            {pick(locale, "কোড শেখার যাত্রা", "Let your coding journey")}{" "}
            <span className="text-orange">
              {pick(locale, "এখান থেকেই", "start right here")}
            </span>{" "}
            {pick(locale, "শুরু হোক", "")}
          </h1>
          <p className="mt-5 text-cream/70">
            {pick(
              locale,
              "প্রজেক্ট করে শেখা, লাইফটাইম অ্যাক্সেস আর যাচাইযোগ্য সার্টিফিকেট — একটাই প্ল্যাটফর্মে।",
              "Project-based learning, lifetime access and verifiable certificates — all on one platform."
            )}
          </p>

          <div className="mt-10 rounded-2xl border border-cream/15 bg-cream/[0.06] p-5 font-mono text-sm backdrop-blur">
            <p className="text-cream/45">{pick(locale, "// আজকের লক্ষ্য", "// today's goal")}</p>
            <p className="mt-2 text-cream/85">
              <span className="text-sky">const</span> firstStep ={" "}
              <span className="text-green-light">
                &quot;{pick(locale, "শুরু করা", "getting started")}&quot;
              </span>
              ;
            </p>
            <p className="text-cream/85">
              <span className="text-orange">start</span>(firstStep);
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-green-light">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-green-light/20">✓</span>
              {pick(locale, "বাকিটা অভ্যাসের খেলা", "the rest is just practice")}
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-xs text-cream/50">
          <Link href="/" className="hover:text-cream">
            ← {pick(locale, "হোমে ফিরুন", "Back home")}
          </Link>
          <span>•</span>
          <Link href="/courses" className="hover:text-cream">
            {pick(locale, "কোর্স দেখুন", "Browse courses")}
          </Link>
        </div>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <Logo />
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <Link href="/" className="text-xs font-semibold text-muted hover:text-ink">
              ← {pick(locale, "হোম", "Home")}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 p-5 text-center text-[0.7rem] text-muted">
          <span className="hidden lg:inline">
            <LocaleSwitcher locale={locale} />
          </span>
          <span>
            {pick(locale, "সমস্যা হচ্ছে?", "Having trouble?")}{" "}
            <Link href="/contact" className="underline hover:text-ink">
              {pick(locale, "আমাদের জানান", "Let us know")}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
