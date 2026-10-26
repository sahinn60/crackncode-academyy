import type { Metadata } from "next";
import Link from "next/link";
import { listCourses } from "@/lib/data";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "CrackNcode Academy — সহজ বাংলায় কোডিং ও টেক স্কিল শেখার প্ল্যাটফর্ম।",
};

const values = [
  {
    title: "সহজ ভাষায় শেখা",
    text: "জার্গনের বদলে উদাহরণ। কঠিন কনসেপ্টও ছোট ছোট ধাপে ভেঙে বোঝানো হয়।",
  },
  {
    title: "কাজ করে শেখা",
    text: "ভিডিও দেখে নয়, নিজে বানিয়ে শেখা। প্রতিটি কোর্সে বাস্তব প্রজেক্ট থাকে।",
  },
  {
    title: "সবার জন্য উন্মুক্ত",
    text: "ইঞ্জিনিয়ারিং ডিগ্রি লাগবে না। ল্যাপটপ আর আগ্রহ থাকলেই শুরু করা যায়।",
  },
  {
    title: "ক্যারিয়ার ফোকাস",
    text: "শেখার শেষে পোর্টফোলিও, সার্টিফিকেট আর ইন্টারভিউ প্রস্তুতি — সব একসাথে।",
  },
];

const milestones = [
  { value: "১২+", label: "প্রজেক্ট-বেসড কোর্স" },
  { value: "১৪০+", label: "লেসন ও রিসোর্স" },
  { value: "১০০%", label: "বাংলায় শেখা" },
  { value: "২৪/৭", label: "কমিউনিটি সাপোর্ট" },
];

export default async function AboutPage() {
  const courses = await listCourses();
  const instructors = Array.from(
    new Map(
      courses.map((c) => [
        c.instructor_name,
        { name: c.instructor_name, title: c.instructor_title, bio: c.instructor_bio },
      ])
    ).values()
  ).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" />
        <div className="container-cn relative py-14 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">আমাদের সম্পর্কে</span>
          </nav>
          <span className="eyebrow mt-6">আমাদের গল্প</span>
          <h1 className="section-title mt-4 max-w-4xl text-3xl leading-tight md:text-5xl">
            বাংলায় টেক শেখার দরজাটা <span className="text-orange-deep">সহজ</span> করে দিতে
            চাই
          </h1>
          <p className="mt-5 max-w-3xl text-[1.02rem] leading-relaxed text-muted">
            অনেক আগ্রহী শিক্ষার্থী প্রোগ্রামিং বা ফ্রিল্যান্সিং শুরু করতে চায়, কিন্তু
            ইংরেজি কোর্স, দামি বুটক্যাম্প আর অস্পষ্ট রোডম্যাপে আটকে যায়। CrackNcode Academy
            সেই দূরত্ব কমাতে তৈরি — সাশ্রয়ী, প্রজেক্ট-বেসড আর সম্পূর্ণ বাংলায় সাজানো
            কোর্স নিয়ে।
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.label} className="rounded-xl border border-line-soft bg-surface p-4">
                <p className="font-display text-2xl font-bold">{m.value}</p>
                <p className="mt-0.5 text-xs text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cn py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">কেন আছি</span>
            <h2 className="section-title mt-4 text-3xl">আমাদের মিশন</h2>
          </div>
          <div className="space-y-4 text-[0.98rem] leading-relaxed text-muted">
            <p>
              আমাদের লক্ষ্য একটাই — বাংলাদেশের যেকোনো জায়গার একজন শিক্ষার্থী যেন নিজের
              ভাষায়, নিজের গতিতে, হাতে-কলমে টেক স্কিল শিখতে পারে। শেখার পথে দামি ডিগ্রি
              বা বড় শহরের কোচিং যেন বাধা না হয়।
            </p>
            <p>
              তাই প্রতিটি কোর্স ছোট ছোট ধাপে সাজানো, প্রতিটি মডিউলে হাতে-কলমে কাজ, আর
              প্রতিটি লেসনের ভাষা সহজ রাখা হয়। শেষে থাকে পোর্টফোলিও-ready প্রজেক্ট আর
              যাচাইযোগ্য সার্টিফিকেট।
            </p>
          </div>
        </div>

        <figure className="mt-10 overflow-hidden rounded-3xl border border-line-soft bg-surface">
          <img
            src="/images/about-team.webp"
            alt="CrackNcode Academy-এর মেন্টর দল একসাথে কাজ করছে"
            className="h-60 w-full object-cover md:h-96"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line-soft px-5 py-3 text-xs text-muted">
            <span>মেন্টর টিম — যারা কোর্স বানান আর লাইভ সেশনে শেখান</span>
            <span className="font-semibold text-orange-deep">৪ জন ইন্সট্রাক্টর</span>
          </figcaption>
        </figure>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line-soft bg-surface p-6">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange/20 font-mono text-xs font-bold text-orange-deep">
                {"</>"}
              </span>
              <h3 className="font-display mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface-2/50 py-14">
        <div className="container-cn">
          <span className="eyebrow">ইনস্ট্রাক্টর প্যানেল</span>
          <h2 className="section-title mt-4 text-3xl">যারা শেখাবেন</h2>
          <p className="mt-3 max-w-2xl text-muted">
            ইন্ডাস্ট্রিতে কাজ করা প্র্যাকটিশনার — যারা জটিল বিষয়কে সহজভাবে বুঝিয়ে দিতে
            পারেন।
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((ins) => (
              <div key={ins.name} className="rounded-2xl border border-line-soft bg-surface p-5">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl font-bold text-cream">
                  {ins.name.charAt(0)}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold">{ins.name}</h3>
                <p className="text-[0.7rem] font-semibold text-orange-deep">{ins.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{ins.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-cn py-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border-2 border-line bg-orange p-8 text-navy shadow-[6px_6px_0_var(--shadow-color)] lg:flex-row lg:items-center">
          <div>
            <h2 className="section-title text-2xl md:text-3xl">আমাদের সাথে শেখা শুরু করুন</h2>
            <p className="mt-1 text-sm text-navy/80">
              ফ্রি অ্যাকাউন্ট খুলে আজই প্রথম কোর্সে ঢুকে পড়ুন।
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses" className="btn btn-dark">কোর্স দেখুন</Link>
            <Link href="/contact" className="btn btn-outline border-navy text-navy hover:bg-navy/10">
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
