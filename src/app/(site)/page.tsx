import Link from "next/link";
import { CourseCard, SectionHeading } from "@/components/ui";
import { listBundles, listCourses, listEbooks, listWorkshops } from "@/lib/data";
import { bengaliNumber, discountPercent, formatDate, formatTaka } from "@/lib/utils";

const tools = [
  "JavaScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "Git",
  "Figma",
  "Flutter",
  "ChatGPT",
  "Claude",
  "Power BI",
  "Docker",
  "WordPress",
];

const reviews = [
  {
    name: "ফারহানা আক্তার",
    course: "ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট",
    image: "/images/reviews/farhana.webp",
    text: "প্রতিটি মডিউলে ছোট ছোট প্রজেক্ট ছিল। কোর্স শেষে পোর্টফোলিওতে তিনটি লাইভ সাইট — চাকরির ইন্টারভিউতেই কাজে এসেছে।",
  },
  {
    name: "রিয়াজুল ইসলাম",
    course: "AI Prompt Engineering মাস্টারক্লাস",
    image: "/images/reviews/riajul.webp",
    text: "অফিসের রিপোর্ট আর ইমেইলের কাজে AI ব্যবহার শুরু করেছি। রোজকার কাজে সময় প্রায় অর্ধেক কমে গেছে, বাংলায় ব্যাখ্যা থাকায় বুঝতেও সমস্যা হয়নি।",
  },
  {
    name: "আমিনা খাতুন",
    course: "UI/UX ডিজাইন উইথ ফিগমা",
    image: "/images/reviews/ameena.webp",
    text: "শূন্য থেকে শুরু করে ফিগমায় পূর্ণাঙ্গ প্রজেক্ট বানানো শিখেছি। ইনস্ট্রাক্টরের ফিডব্যাক আর কমিউনিটির সাপোর্ট ছিল সবচেয়ে বড় পাওয়া।",
  },
  {
    name: "সাইফুল হাসান",
    course: "ফ্রিল্যান্সিং: Fiverr ও Upwork A-Z",
    image: "/images/reviews/saiful.webp",
    text: "প্রোফাইল, গিগ আর প্রপোজাল — সব ধাপে ধাপে শেখানো হয়েছে। প্রথম ক্লায়েন্ট পাওয়ার পর বুঝেছি, গোছানো শেখাটা কতটা জরুরি।",
  },
];

const paths = [
  {
    letter: "এ",
    title: "AI ও অটোমেশন",
    text: "প্রম্পট, ChatGPT, Claude আর রোজকার ওয়ার্কফ্লো অটোমেশন।",
    href: "/courses?category=AI",
    icon: "/images/icons/ai-robot.webp",
  },
  {
    letter: "ডি",
    title: "ডিজাইন ও ক্রিয়েটিভ",
    text: "UI/UX, ফিগমা আর প্রোডাক্ট ডিজাইনের হাতে-কলমে প্র্যাকটিস।",
    href: `/courses?category=${encodeURIComponent("ডিজাইন")}`,
    icon: "/images/icons/design.webp",
  },
  {
    letter: "ক",
    title: "ক্যারিয়ার ও ফ্রিল্যান্সিং",
    text: "পোর্টফোলিও, গিগ, ইন্টারভিউ আর ক্লায়েন্ট ম্যানেজমেন্ট।",
    href: `/courses?category=${encodeURIComponent("ফ্রিল্যান্সিং")}`,
    icon: "/images/icons/career.webp",
  },
  {
    letter: "লা",
    title: "লাইভ ওয়ার্কশপ",
    text: "ইনস্ট্রাক্টরের সাথে লাইভ ক্লাস, সরাসরি প্রশ্ন করুন।",
    href: "/workshops",
    icon: "/images/icons/live.webp",
  },
  {
    letter: "ই",
    title: "ই-বুক লাইব্রেরি",
    text: "অল্প দামে গোছানো গাইড, যেকোনো সময় পড়ুন।",
    href: "/ebooks",
    icon: "/images/icons/ebook.webp",
  },
];

export default function HomePage() {
  const allCourses = listCourses();
  const featured = allCourses.filter((c) => c.featured).slice(0, 4);
  const featuredCourses = featured.length ? featured : allCourses.slice(0, 4);
  const recorded = allCourses.slice(4, 12);
  const workshops = listWorkshops();
  const ebooks = listEbooks();
  const bundles = listBundles();
  const bundle = bundles.find((b) => b.slug === "all-access-combo") ?? bundles[0];
  const aiCourse =
    allCourses.find((c) => c.slug === "ai-prompt-engineering") ?? allCourses[0];
  const totalLessons = allCourses.reduce((n, c) => n + c.lesson_count, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-orange/10 blur-3xl" />
        <div className="container-cn relative grid items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-16">
          <div>
            <span className="eyebrow">
              <span className="live-dot" />
              বাংলায় শেখার খাতা · নতুন ব্যাচ চলছে
            </span>
            <h1 className="section-title mt-5 text-[2.35rem] leading-[1.14] sm:text-[3.2rem]">
              কোডিং, <span className="text-orange-deep">AI</span>, ডিজাইন
              <br className="hidden sm:block" /> আর ফ্রিল্যান্সিং —
              <br className="hidden sm:block" /> সব শিখুন{" "}
              <span className="relative inline-block">
                বাংলায়
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  height="11"
                  viewBox="0 0 200 11"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M3 7c34-5 70-6 101-4 31 2 63 3 93-1"
                    stroke="#f39322"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , নিজের গতিতে।
            </h1>
            <p className="mt-6 max-w-xl text-[1.01rem] leading-relaxed text-muted">
              ফ্রেশার হোক কিংবা প্রফেশনাল — কাজে লাগার মতো স্কিল শিখুন ছোট ছোট লেসনে।
              ভিডিও দেখে নয়, নিজে প্রজেক্ট বানিয়ে। শেষে যাচাইযোগ্য সার্টিফিকেট।
            </p>

            <div className="mt-6 inline-flex rounded-full border border-line bg-surface p-1 text-xs font-semibold">
              <a href="#featured" className="rounded-full bg-navy px-4 py-1.5 text-cream">
                শিখছি
              </a>
              <a href="#paths" className="rounded-full px-4 py-1.5 text-muted hover:text-ink">
                বানাচ্ছি
              </a>
              <a href="#workshops" className="rounded-full px-4 py-1.5 text-muted hover:text-ink">
                আয় করছি
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-primary btn-lg">
                কোর্স দেখুন
                <span aria-hidden>→</span>
              </Link>
              <Link href="/workshops" className="btn btn-outline btn-lg">
                ফ্রি ওয়ার্কশপ
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 border-t border-line-soft pt-6 sm:grid-cols-4">
              <div>
                <p className="font-display text-xl font-bold">{bengaliNumber(allCourses.length)}+</p>
                <p className="text-[0.68rem] text-muted">লাইভ কোর্স</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">{bengaliNumber(totalLessons)}+</p>
                <p className="text-[0.68rem] text-muted">ভিডিও লেসন</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">১০০%</p>
                <p className="text-[0.68rem] text-muted">বাংলায়</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">লাইফটাইম</p>
                <p className="text-[0.68rem] text-muted">অ্যাক্সেস</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <span className="sticker absolute -top-3 right-3 z-20 rotate-2 sm:right-6">
              লাইফটাইম অ্যাক্সেস
            </span>
            <div className="overflow-hidden rounded-[1.6rem] border-2 border-navy bg-cream-2 shadow-[10px_12px_0_rgba(243,147,34,0.92)]">
              <img
                src="/images/hero-collage.webp"
                alt="বাংলাদেশি শিক্ষার্থীরা ল্যাপটপে কোডিং ও AI শিখছে"
                className="aspect-[4/3] w-full object-cover object-[72%_center]"
              />
            </div>
            <div className="absolute -bottom-5 -left-2 z-20 hidden items-center gap-2.5 rounded-xl border border-line bg-surface/95 px-3 py-2.5 shadow-lg backdrop-blur sm:-left-5 sm:flex">
              <img
                src="/images/icons/career.webp"
                alt=""
                className="h-9 w-9 rounded-lg object-cover"
              />
              <div>
                <p className="text-[0.58rem] uppercase tracking-widest text-muted">কোর্স শেষে</p>
                <p className="text-xs font-bold">যাচাইযোগ্য সার্টিফিকেট</p>
              </div>
            </div>
            <div className="absolute -right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-xl border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur md:block">
              <p className="font-display text-lg font-bold text-orange-deep">
                {bengaliNumber(workshops.length)}টি
              </p>
              <p className="text-[0.6rem] text-muted">লাইভ ওয়ার্কশপ</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-surface-2/70">
        <div className="marquee py-3">
          <div className="marquee-track items-center gap-7">
            {[...tools, ...tools].map((tool, i) => (
              <span key={`${tool}-${i}`} className="inline-flex items-center gap-7 whitespace-nowrap">
                <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted">
                  {tool}
                </span>
                <span className="text-sm text-orange">✳</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section id="reviews" className="container-cn py-14 lg:py-20">
        <SectionHeading
          eyebrow="লার্নার রিভিউ"
          title="শিক্ষার্থীরা নিজের ভাষায় যা বলছেন"
          description="কোর্স শেষে তাদের কাজে কী বদলাল — সেটাই আসল প্রমাণ।"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[6px_8px_0_rgba(11,21,48,0.06)]"
            >
              <span className="font-display text-3xl leading-none text-orange" aria-hidden>
                “
              </span>
              <p className="mt-2 text-[0.9rem] leading-relaxed">{review.text}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-dashed border-line pt-4">
                <img
                  src={review.image}
                  alt={review.name}
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-orange/60"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{review.name}</p>
                  <p className="truncate text-[0.65rem] text-muted">{review.course}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-[0.66rem] text-muted">
          *পোর্ট্রেটগুলো AI-জেনারেটেড, বাস্তব ব্যক্তির ছবি নয়।
        </p>
      </section>

      <section id="featured" className="border-y border-line bg-surface-2/50 py-14 lg:py-20">
        <div className="container-cn">
          <SectionHeading
            eyebrow="জনপ্রিয় কোর্স"
            title="বাছাই করা কোর্স"
            description="নতুনদের জন্য সহজ ভাষায় সাজানো, প্রজেক্ট-বেসড কারিকুলাম। যেকোনো একটি দিয়ে শুরু করুন।"
            href="/courses"
            linkLabel="সব কোর্স"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                subtitle={course.subtitle}
                category={course.category}
                level={course.level}
                hours={course.hours}
                lessonCount={course.lesson_count}
                price={course.price}
                originalPrice={course.original_price}
                gradient={course.gradient}
                icon={course.icon}
                image={course.image}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-cn py-14 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl border-2 border-navy bg-navy text-cream">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border-[24px] border-cream/5" />
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange/50 bg-orange/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-orange">
                রেকর্ডেড · AI
              </span>
              <h2 className="section-title mt-4 text-3xl md:text-[2.4rem]">
                এখন AI পাওয়ার-ইউজার হয়ে উঠুন
              </h2>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-cream/70">
                {aiCourse.subtitle} — প্রম্পট থেকে অটোমেশন পর্যন্ত, প্রতিদিনের কাজে সরাসরি
                ব্যবহার করার মতো ওয়ার্কফ্লো।
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  "প্রম্পট ফাউন্ডেশন থেকে অ্যাডভান্সড টেকনিক",
                  "ChatGPT, Claude ও Gemini একসাথে",
                  "রিপোর্ট, কনটেন্ট আর অফিস ওয়ার্কফ্লো অটোমেশন",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange/20 text-[0.62rem] font-bold text-orange">
                      ✓
                    </span>
                    <span className="text-cream/85">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-cream/15 pt-5 text-sm">
                <div>
                  <p className="font-display text-lg font-bold text-orange">
                    {bengaliNumber(aiCourse.curriculum.length)}
                  </p>
                  <p className="text-[0.65rem] text-cream/60">মডিউল</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-orange">
                    {bengaliNumber(aiCourse.lesson_count)}
                  </p>
                  <p className="text-[0.65rem] text-cream/60">লেসন</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-orange">লাইফটাইম</p>
                  <p className="text-[0.65rem] text-cream/60">অ্যাক্সেস</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={`/courses/${aiCourse.slug}`} className="btn btn-primary">
                  কোর্সটি দেখুন
                </Link>
                <span className="text-sm text-cream/60">{formatTaka(aiCourse.price)}</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-cream/15">
                <img
                  src={aiCourse.image}
                  alt={aiCourse.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <img
                src="/images/icons/ai-robot.webp"
                alt=""
                className="absolute -right-3 -top-7 w-20 rounded-2xl border border-cream/20 shadow-xl sm:w-24"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="paths" className="border-y border-line bg-surface-2/50 py-14 lg:py-20">
        <div className="container-cn">
          <SectionHeading
            eyebrow="লার্নিং পাথ"
            title="কোন পথে শিখবেন?"
            description="আপনার লক্ষ্যটা বেছে নিন, বাকিটা আমরা সাজিয়ে দিয়েছি।"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {paths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-transform hover:-translate-y-1 hover:border-line-soft"
              >
                <span
                  className="pointer-events-none absolute -right-1 -top-3 font-display text-[4.4rem] font-bold leading-none text-navy/5"
                  aria-hidden
                >
                  {path.letter}
                </span>
                <img
                  src={path.icon}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 rounded-xl object-cover shadow-sm"
                />
                <h3 className="font-display mt-4 text-[1.02rem] font-bold leading-snug">
                  {path.title}
                </h3>
                <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted">{path.text}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.72rem] font-semibold text-orange-deep">
                  দেখুন
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="workshops" className="container-cn py-14 lg:py-20">
        <SectionHeading
          eyebrow="লাইভ ওয়ার্কশপ"
          title="অল্প সময়ে হাতে-কলমে শিখুন"
          description="ইনস্ট্রাক্টরের সাথে সরাসরি ক্লাস, প্রশ্ন করার সুযোগ আর রেকর্ডিং অ্যাক্সেস।"
          href="/workshops"
          linkLabel={`সব ওয়ার্কশপ (${bengaliNumber(workshops.length)})`}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {workshops.map((workshop) => {
            const filled = Math.round(
              ((workshop.seats_total - workshop.seats_left) / workshop.seats_total) * 100
            );
            return (
              <Link
                key={workshop.id}
                href="/workshops"
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-sm bg-live px-2 py-0.5 text-[0.62rem] font-bold text-white">
                    <span className="live-dot !bg-white" /> লাইভ
                  </span>
                  <span className="absolute right-2.5 top-2.5 rounded-sm bg-cream/95 px-2 py-0.5 text-[0.62rem] font-bold text-navy">
                    {formatDate(workshop.starts_at)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-orange-deep">
                    {workshop.duration} · অনলাইন
                  </p>
                  <h3 className="font-display mt-1 text-[1.02rem] font-bold leading-snug">
                    {workshop.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
                    {workshop.description}
                  </p>
                  <div className="mt-4">
                    <div className="progress-track h-1.5">
                      <div className="progress-fill" style={{ width: `${filled}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[0.65rem] text-muted">
                      <span>{bengaliNumber(workshop.seats_left)} সিট বাকি</span>
                      <span>{bengaliNumber(filled)}% ভরা</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3">
                    <span className="font-display font-bold">
                      {workshop.price === 0 ? "ফ্রি" : formatTaka(workshop.price)}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-sm transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-navy">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-surface-2/50 py-14 lg:py-20">
        <div className="container-cn grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="eyebrow">যেকোনো ডিভাইসে</span>
            <h2 className="section-title mt-4 text-3xl md:text-[2.4rem]">
              আপনার কোর্স এখন পকেটে
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              সকালের বাসে, লাঞ্চ ব্রেকে বা রাতের আড্ডায় — যেখানে খুশি পড়া চালিয়ে যান।
              প্রোগ্রেস অটো সেভ হয়, তাই কোথাও থেকে শুরু করলেও এগিয়ে থাকবেন।
            </p>
            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {[
                "প্রোগ্রেস অটো-সেভ",
                "লেসন নোট ও রিসোর্স",
                "যাচাইযোগ্য সার্টিফিকেট",
                "মোবাইল ও ডেস্কটপে ফাস্ট",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green/15 text-[0.65rem] font-bold text-green">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-dark">
                আজই এনরোল করুন
              </Link>
              <Link href="/login" className="btn btn-outline">
                লগইন করুন
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="absolute inset-x-0 -bottom-6 mx-auto h-10 w-2/3 rounded-full bg-navy/20 blur-2xl" />
            <div className="relative rounded-[2.2rem] border-[6px] border-navy bg-page p-2 shadow-2xl">
              <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-navy/30" />
              <div className="overflow-hidden rounded-[1.5rem] border border-line-soft bg-page">
                <div className="bg-navy px-4 pb-8 pt-4 text-cream">
                  <div className="flex items-center justify-between text-[0.6rem] text-cream/60">
                    <span>৯:৪১</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cream/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cream/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                    </span>
                  </div>
                  <p className="mt-4 text-[0.65rem] uppercase tracking-widest text-orange">
                    আমার ড্যাশবোর্ড
                  </p>
                  <p className="font-display text-lg font-bold">স্বাগতম, শিক্ষার্থী</p>
                </div>
                <div className="-mt-2 space-y-3 p-4">
                  {[
                    { title: "ফুল-স্ট্যাক ওয়েব", progress: 65, color: "bg-orange" },
                    { title: "AI প্রম্পট মাস্টার", progress: 30, color: "bg-green-light" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-line-soft bg-surface p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-7 w-7 rounded-lg ${item.color}`} />
                        <p className="text-[0.72rem] font-semibold">{item.title}</p>
                      </div>
                      <div className="progress-track mt-2.5 h-1.5">
                        <div className="progress-fill" style={{ width: `${item.progress}%` }} />
                      </div>
                      <p className="mt-1.5 text-[0.6rem] text-muted">
                        {item.progress}% সম্পন্ন
                      </p>
                    </div>
                  ))}
                  <div className="rounded-xl bg-orange/15 p-3 text-center">
                    <p className="text-[0.65rem] font-semibold text-orange-deep">
                      পরবর্তী লেসন: React Basics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recorded" className="container-cn py-14 lg:py-20">
        <SectionHeading
          eyebrow="রেকর্ডেড কোর্স"
          title="নিজের সময়ে, নিজের গতিতে"
          description="লাইফটাইম অ্যাক্সেস — একবার এনরোল করলে ভবিষ্যতের আপডেটও পাবেন।"
          href="/courses"
          linkLabel={`সব কোর্স (${bengaliNumber(allCourses.length)})`}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recorded.map((course) => (
            <CourseCard
              key={course.id}
              slug={course.slug}
              title={course.title}
              subtitle={course.subtitle}
              category={course.category}
              level={course.level}
              hours={course.hours}
              lessonCount={course.lesson_count}
              price={course.price}
              originalPrice={course.original_price}
              gradient={course.gradient}
              icon={course.icon}
              image={course.image}
            />
          ))}
        </div>
      </section>

      <section id="ebooks" className="border-y border-line bg-surface-2/50 py-14 lg:py-20">
        <div className="container-cn">
          <SectionHeading
            eyebrow="ই-বুক লাইব্রেরি"
            title="ফোনে বা ল্যাপটপে, যেখানে খুশি পড়ুন"
            description="কম দামে একদম কাজের গাইড — লাইফটাইম অ্যাক্সেসসহ।"
            href="/ebooks"
            linkLabel="সব ই-বুক"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ebooks.slice(0, 8).map((book) => (
              <Link
                key={book.id}
                href="/ebooks"
                className="book-stage group rounded-2xl border border-line bg-surface p-4 pb-5"
              >
                <div className="book-shelf">
                  <div className="book-cover" style={{ background: book.gradient }}>
                    <div className="book-cover-inner">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-cream/60">
                        CrackNcode
                      </span>
                      <span className="font-display mt-3 text-[0.98rem] font-bold leading-snug text-cream">
                        {book.title}
                      </span>
                      <span className="mt-auto text-[0.58rem] font-semibold uppercase tracking-widest text-cream/70">
                        ই-বুক · {bengaliNumber(book.pages)} পেজ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
                  <div>
                    <p className="text-[0.62rem] text-muted">লাইফটাইম অ্যাক্সেস</p>
                    <p className="font-display font-bold">
                      {book.price === 0 ? "ফ্রি" : formatTaka(book.price)}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-sm transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-navy">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {bundle && (
        <section className="container-cn py-14 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border-2 border-navy bg-cream text-navy shadow-[8px_10px_0_rgba(11,21,48,0.9)] dark:bg-navy-2 dark:text-cream dark:shadow-none">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-[22px] border-orange/40" />
            <div className="pointer-events-none absolute -bottom-10 right-1/4 font-mono text-[7rem] font-bold leading-none text-navy/5 dark:text-cream/5">
              {"</>"}
            </div>
            <div className="relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-orange px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-navy">
                  বান্ডেল · সেরা মূল্য
                </span>
                <h2 className="section-title mt-3 text-3xl md:text-[2.3rem]">
                  {bundle.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted dark:text-cream/70">
                  {bundle.description} একবার পেমেন্টে সব কোর্স, ভবিষ্যতের নতুন কোর্সও
                  একই অ্যাক্সেসে।
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="font-display text-3xl font-bold">{formatTaka(bundle.price)}</span>
                  <span className="text-sm text-muted line-through dark:text-cream/50">
                    {formatTaka(bundle.original_price)}
                  </span>
                  <span className="rounded-md bg-green/10 px-2 py-0.5 text-xs font-bold text-green">
                    {discountPercent(bundle.price, bundle.original_price)}% ছাড়
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/checkout/bundle/${bundle.id}`} className="btn btn-primary">
                    বান্ডেলটি নিন
                  </Link>
                  <Link href="/bundles" className="btn btn-outline">
                    সব বান্ডেল
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-surface/70 p-5 dark:border-cream/10 dark:bg-cream/5">
                {[
                  `${bengaliNumber(allCourses.length)}টি কোর্স একসাথে`,
                  "ভবিষ্যতের কোর্স আপডেট",
                  "লাইফটাইম অ্যাক্সেস",
                  "সার্টিফিকেট অন্তর্ভুক্ত",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-medium">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-orange/20 text-[0.62rem] font-bold text-orange-deep">
                      ✓
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container-cn pb-16">
        <div className="relative overflow-hidden rounded-3xl border-2 border-navy bg-orange px-6 py-10 text-navy sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-[20px] border-navy/10" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 font-mono text-[8rem] font-bold leading-none text-navy/5">
            {"</>"}
          </div>
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="font-hand text-2xl text-navy/80">শেখা থামিয়ে দেবেন না</p>
              <h2 className="section-title mt-1 text-3xl md:text-[2.5rem]">
                এটা শুধু ভিডিওর লাইব্রেরি না — এটা আপনার শেখার খাতা।
              </h2>
              <p className="mt-2 max-w-xl text-sm text-navy/80">
                ছোট লেসন, বাংলায় ব্যাখ্যা, আর এমন স্কিল যা কালকেই কাজে লাগে। আজই
                প্রথম ধাপটা নিন।
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-dark btn-lg">
                ফ্রি অ্যাকাউন্ট খুলুন
              </Link>
              <Link
                href="/courses"
                className="btn btn-outline btn-lg border-navy text-navy hover:bg-navy/10"
              >
                কোর্স ব্রাউজ করুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
