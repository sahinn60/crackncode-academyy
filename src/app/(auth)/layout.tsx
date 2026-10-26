import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="auth-panel relative hidden overflow-hidden p-10 lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(244,240,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,240,232,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative text-cream">
          <Logo />
        </div>

        <div className="relative mt-auto mb-auto max-w-md py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-3 py-1 text-xs font-semibold text-cream/80">
            <span className="live-dot" /> নতুন ব্যাচ চলছে
          </span>
          <h1 className="section-title mt-6 text-4xl leading-tight text-cream xl:text-5xl">
            কোড শেখার যাত্রা <span className="text-orange">এখান থেকেই</span> শুরু হোক
          </h1>
          <p className="mt-5 text-cream/70">
            প্রজেক্ট করে শেখা, লাইফটাইম অ্যাক্সেস আর যাচাইযোগ্য সার্টিফিকেট — একটাই
            প্ল্যাটফর্মে।
          </p>

          <div className="mt-10 rounded-2xl border border-cream/15 bg-cream/[0.06] p-5 font-mono text-sm backdrop-blur">
            <p className="text-cream/45">{"// আজকের লক্ষ্য"}</p>
            <p className="mt-2 text-cream/85">
              <span className="text-sky">const</span> firstStep ={" "}
              <span className="text-green-light">&quot;শুরু করা&quot;</span>;
            </p>
            <p className="text-cream/85">
              <span className="text-orange">start</span>(firstStep);
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-green-light">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-green-light/20">✓</span>
              বাকিটা অভ্যাসের খেলা
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-xs text-cream/50">
          <Link href="/" className="hover:text-cream">← হোমে ফিরুন</Link>
          <span>•</span>
          <Link href="/courses" className="hover:text-cream">কোর্স দেখুন</Link>
        </div>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <Logo />
          <Link href="/" className="text-xs font-semibold text-muted hover:text-ink">
            ← হোম
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="p-5 text-center text-[0.7rem] text-muted">
          সমস্যা হচ্ছে?{" "}
          <Link href="/contact" className="underline hover:text-ink">আমাদের জানান</Link>
        </p>
      </div>
    </div>
  );
}
