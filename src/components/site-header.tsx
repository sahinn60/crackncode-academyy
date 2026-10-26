import Link from "next/link";
import { Logo } from "./logo";
import { HeaderNav } from "./header-nav";
import { getCurrentUser } from "@/lib/auth";

const tickerItems = [
  "নতুন ব্যাচ শুরু ৫ নভেম্বর — ফুল-স্ট্যাক কোর্সে ৫০% ছাড়",
  "লাইভ ওয়ার্কশপ: ২ ঘণ্টায় নিজের প্রথম ওয়েবসাইট",
  "সব কোর্সে লাইফটাইম অ্যাক্সেস ও প্রজেক্ট রিভিউ",
  "ফ্রি ই-বুক: প্রোগ্রামিং শুরু করার রোডম্যাপ",
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page/90 backdrop-blur-md">
      <div className="overflow-hidden bg-navy text-cream">
        <div className="container-cn flex items-center gap-3 py-1.5">
          <span className="shrink-0 rounded-full border border-orange/60 bg-orange/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-orange">
            আপডেট
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track items-center gap-10 text-[0.72rem] text-cream/80">
              {[...tickerItems, ...tickerItems].map((text, i) => (
                <span key={i} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap">
                  <span className="h-1 w-1 rounded-full bg-orange" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/workshops"
            className="hidden shrink-0 text-[0.7rem] font-semibold text-orange hover:underline sm:block"
          >
            দেখুন →
          </Link>
        </div>
      </div>

      <div className="container-cn relative flex h-[4.4rem] items-center gap-4">
        <Logo />
        <div className="hidden h-6 w-px bg-line-soft lg:block" />
        <HeaderNav
          user={
            user
              ? { name: user.name, email: user.email, role: user.role }
              : null
          }
        />
      </div>
    </header>
  );
}
