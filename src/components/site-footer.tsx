import Link from "next/link";
import { Logo } from "./logo";
import { SubscribeForm } from "./subscribe-form";

const columns = [
  {
    title: "লার্নিং",
    links: [
      { href: "/courses", label: "সব কোর্স" },
      { href: "/bundles", label: "বান্ডেল" },
      { href: "/workshops", label: "লাইভ ওয়ার্কশপ" },
      { href: "/ebooks", label: "ই-বুক" },
    ],
  },
  {
    title: "কোম্পানি",
    links: [
      { href: "/about", label: "আমাদের সম্পর্কে" },
      { href: "/blog", label: "ব্লগ" },
      { href: "/contact", label: "যোগাযোগ" },
      { href: "/verify", label: "সার্টিফিকেট যাচাই" },
    ],
  },
  {
    title: "সাপোর্ট",
    links: [
      { href: "/privacy", label: "প্রাইভেসি পলিসি" },
      { href: "/terms", label: "ব্যবহারের শর্ত" },
      { href: "/refund", label: "রিফান্ড নীতি" },
      { href: "/contact", label: "সাহায্য কেন্দ্র" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-navy text-cream">
      <div className="container-cn grid gap-10 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="[&_span]:text-cream [&_.text-muted]:text-cream/60">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            সহজ বাংলায় কোডিং ও টেক স্কিল শেখার প্ল্যাটফর্ম। প্রজেক্ট-বেসড কোর্স, লাইভ
            ওয়ার্কশপ আর ক্যারিয়ার সাপোর্ট — সব এক জায়গায়।
          </p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cream/50">
              নিউজলেটার
            </p>
            <SubscribeForm />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-cream/20 px-2.5 py-1 text-[0.65rem] font-bold text-cream/80">
              bKash
            </span>
            <span className="rounded-lg border border-cream/20 px-2.5 py-1 text-[0.65rem] font-bold text-cream/80">
              Nagad
            </span>
            <span className="rounded-lg border border-cream/20 px-2.5 py-1 text-[0.65rem] font-bold text-cream/80">
              Visa / Mastercard
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-cn flex flex-col items-center justify-between gap-3 py-5 text-[0.72rem] text-cream/50 sm:flex-row">
          <p>© ২০২৬ CrackNcode Academy। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5">
            তৈরি হয়েছে বাংলাদেশে
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
            বাংলায় শেখার জন্য
          </p>
        </div>
      </div>
    </footer>
  );
}
