import Link from "next/link";
import { CourseCard, SectionHeading } from "@/components/ui";
import { listBundles, listCourses, listEbooks, listWorkshops } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick, type Locale } from "@/lib/i18n";
import { formatNumber, discountPercent, formatDate, formatTaka } from "@/lib/utils";

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

const reviews = (locale: Locale) => [
  {
    name: pick(locale, "ফারহানা আক্তার", "Farhana Akter"),
    course: pick(locale, "ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট", "Full-Stack Web Development"),
    image: "/images/reviews/farhana.webp",
    text: pick(
      locale,
      "প্রতিটি মডিউলে ছোট ছোট প্রজেক্ট ছিল। কোর্স শেষে পোর্টফোলিওতে তিনটি লাইভ সাইট — চাকরির ইন্টারভিউতেই কাজে এসেছে।",
      "Every module had a small project. By the end I had three live sites in my portfolio — they came in handy right at job interviews."
    ),
  },
  {
    name: pick(locale, "রিয়াজুল ইসলাম", "Riazul Islam"),
    course: pick(locale, "AI Prompt Engineering মাস্টারক্লাস", "AI Prompt Engineering Masterclass"),
    image: "/images/reviews/riajul.webp",
    text: pick(
      locale,
      "অফিসের রিপোর্ট আর ইমেইলের কাজে AI ব্যবহার শুরু করেছি। রোজকার কাজে সময় প্রায় অর্ধেক কমে গেছে, বাংলায় ব্যাখ্যা থাকায় বুঝতেও সমস্যা হয়নি।",
      "I started using AI for office reports and emails. It cut my daily work almost in half, and the Bangla explanations made it easy to follow."
    ),
  },
  {
    name: pick(locale, "আমিনা খাতুন", "Amina Khatun"),
    course: pick(locale, "UI/UX ডিজাইন উইথ ফিগমা", "UI/UX Design with Figma"),
    image: "/images/reviews/ameena.webp",
    text: pick(
      locale,
      "শূন্য থেকে শুরু করে ফিগমায় পূর্ণাঙ্গ প্রজেক্ট বানানো শিখেছি। ইনস্ট্রাক্টরের ফিডব্যাক আর কমিউনিটির সাপোর্ট ছিল সবচেয়ে বড় পাওয়া।",
      "I started from zero and learned to build a complete project in Figma. The instructor's feedback and community support were the biggest win."
    ),
  },
  {
    name: pick(locale, "সাইফুল হাসান", "Saiful Hasan"),
    course: pick(locale, "ফ্রিল্যান্সিং: Fiverr ও Upwork A-Z", "Freelancing: Fiverr & Upwork A-Z"),
    image: "/images/reviews/saiful.webp",
    text: pick(
      locale,
      "প্রোফাইল, গিগ আর প্রপোজাল — সব ধাপে ধাপে শেখানো হয়েছে। প্রথম ক্লায়েন্ট পাওয়ার পর বুঝেছি, গোছানো শেখাটা কতটা জরুরি।",
      "Profile, gigs and proposals — every step taught in order. After landing my first client I realised how much organised learning matters."
    ),
  },
];

const paths = (locale: Locale) => [
  {
    letter: pick(locale, "এ", "A"),
    title: pick(locale, "AI ও অটোমেশন", "AI & Automation"),
    text: pick(
      locale,
      "প্রম্পট, ChatGPT, Claude আর রোজকার ওয়ার্কফ্লো অটোমেশন।",
      "Prompts, ChatGPT, Claude and everyday workflow automation."
    ),
    href: "/courses?category=AI",
    icon: "/images/icons/ai-robot.webp",
  },
  {
    letter: pick(locale, "ডি", "D"),
    title: pick(locale, "ডিজাইন ও ক্রিয়েটিভ", "Design & Creative"),
    text: pick(
      locale,
      "UI/UX, ফিগমা আর প্রোডাক্ট ডিজাইনের হাতে-কলমে প্র্যাকটিস।",
      "UI/UX, Figma and hands-on product design practice."
    ),
    // DB category key — identical in both locales, only the surrounding copy is translated.
    href: `/courses?category=${encodeURIComponent(pick(locale, "ডিজাইন", "ডিজাইন"))}`,
    icon: "/images/icons/design.webp",
  },
  {
    letter: pick(locale, "ক", "C"),
    title: pick(locale, "ক্যারিয়ার ও ফ্রিল্যান্সিং", "Career & Freelancing"),
    text: pick(
      locale,
      "পোর্টফোলিও, গিগ, ইন্টারভিউ আর ক্লায়েন্ট ম্যানেজমেন্ট।",
      "Portfolio, gigs, interviews and client management."
    ),
    // DB category key — identical in both locales.
    href: `/courses?category=${encodeURIComponent(pick(locale, "ফ্রিল্যান্সিং", "ফ্রিল্যান্সিং"))}`,
    icon: "/images/icons/career.webp",
  },
  {
    letter: pick(locale, "লা", "L"),
    title: pick(locale, "লাইভ ওয়ার্কশপ", "Live Workshops"),
    text: pick(
      locale,
      "ইনস্ট্রাক্টরের সাথে লাইভ ক্লাস, সরাসরি প্রশ্ন করুন।",
      "Live classes with the instructor — ask your questions directly."
    ),
    href: "/workshops",
    icon: "/images/icons/live.webp",
  },
  {
    letter: pick(locale, "ই", "E"),
    title: pick(locale, "ই-বুক লাইব্রেরি", "E-book Library"),
    text: pick(
      locale,
      "অল্প দামে গোছানো গাইড, যেকোনো সময় পড়ুন।",
      "Tidy guides at a low price — read them any time."
    ),
    href: "/ebooks",
    icon: "/images/icons/ebook.webp",
  },
];

export default async function HomePage() {
  const locale = await getLocale();
  const allCourses = await listCourses();
  const featured = allCourses.filter((c) => c.featured).slice(0, 4);
  const featuredCourses = featured.length ? featured : allCourses.slice(0, 4);
  const recorded = allCourses.slice(4, 12);
  const workshops = await listWorkshops();
  const ebooks = await listEbooks();
  const bundles = await listBundles();
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
              {pick(locale, "বাংলায় শেখার খাতা · নতুন ব্যাচ চলছে", "A learning notebook in Bangla · New batch live")}
            </span>
            <h1 className="section-title mt-5 text-[2.35rem] leading-[1.14] sm:text-[3.2rem]">
              {pick(locale, "কোডিং, ", "Coding, ")}
              <span className="text-orange-deep">AI</span>
              {pick(locale, ", ডিজাইন", ", design")}
              <br className="hidden sm:block" />
              {pick(locale, " আর ফ্রিল্যান্সিং —", " and freelancing —")}
              <br className="hidden sm:block" /> {pick(locale, "সব শিখুন", "learn it all")}{" "}
              <span className="relative inline-block">
                {pick(locale, "বাংলায়", "in Bangla")}
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
                    stroke="#ED002B"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {pick(locale, ", নিজের গতিতে।", ", at your own pace.")}
            </h1>
            <p className="mt-6 max-w-xl text-[1.01rem] leading-relaxed text-muted">
              {pick(
                locale,
                "ফ্রেশার হোক কিংবা প্রফেশনাল — কাজে লাগার মতো স্কিল শিখুন ছোট ছোট লেসনে। ভিডিও দেখে নয়, নিজে প্রজেক্ট বানিয়ে। শেষে যাচাইযোগ্য সার্টিফিকেট।",
                "Fresh starter or working professional — pick up skills you can actually use, in short lessons. Not just watching videos: you build real projects, and finish with a verifiable certificate."
              )}
            </p>

            <div className="mt-6 inline-flex rounded-full border border-line bg-surface p-1 text-xs font-semibold">
              <a href="#featured" className="rounded-full bg-navy px-4 py-1.5 text-cream">
                {pick(locale, "শিখছি", "Learning")}
              </a>
              <a href="#paths" className="rounded-full px-4 py-1.5 text-muted hover:text-ink">
                {pick(locale, "বানাচ্ছি", "Building")}
              </a>
              <a href="#workshops" className="rounded-full px-4 py-1.5 text-muted hover:text-ink">
                {pick(locale, "আয় করছি", "Earning")}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-primary btn-lg">
                {pick(locale, "কোর্স দেখুন", "Browse courses")}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/workshops" className="btn btn-outline btn-lg">
                {pick(locale, "ফ্রি ওয়ার্কশপ", "Free workshop")}
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 border-t border-line-soft pt-6 sm:grid-cols-4">
              <div>
                <p className="font-display text-xl font-bold">{formatNumber(allCourses.length, locale)}+</p>
                <p className="text-[0.68rem] text-muted">{pick(locale, "লাইভ কোর্স", "Live courses")}</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">{formatNumber(totalLessons, locale)}+</p>
                <p className="text-[0.68rem] text-muted">{pick(locale, "ভিডিও লেসন", "Video lessons")}</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">{formatNumber(100, locale)}%</p>
                <p className="text-[0.68rem] text-muted">{pick(locale, "বাংলায়", "in Bangla")}</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">{pick(locale, "লাইফটাইম", "Lifetime")}</p>
                <p className="text-[0.68rem] text-muted">{pick(locale, "অ্যাক্সেস", "access")}</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <span className="sticker absolute -top-3 right-3 z-20 rotate-2 sm:right-6">
              {pick(locale, "লাইফটাইম অ্যাক্সেস", "Lifetime access")}
            </span>
            <div className="overflow-hidden rounded-[1.6rem] border-2 border-navy bg-cream-2 shadow-[10px_12px_0_rgba(237,0,43,0.92)]">
              <img
                src="/images/hero-collage.webp"
                alt={pick(
                  locale,
                  "বাংলাদেশি শিক্ষার্থীরা ল্যাপটপে কোডিং ও AI শিখছে",
                  "Bangladeshi learners picking up coding and AI on laptops"
                )}
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
                <p className="text-[0.58rem] uppercase tracking-widest text-muted">
                  {pick(locale, "কোর্স শেষে", "After the course")}
                </p>
                <p className="text-xs font-bold">
                  {pick(locale, "যাচাইযোগ্য সার্টিফিকেট", "Verifiable certificate")}
                </p>
              </div>
            </div>
            <div className="absolute -right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-xl border border-line bg-surface/95 px-3 py-2 shadow-lg backdrop-blur md:block">
              <p className="font-display text-lg font-bold text-orange-deep">
                {formatNumber(workshops.length, locale)}
                {pick(locale, "টি", "")}
              </p>
              <p className="text-[0.6rem] text-muted">
                {pick(locale, "লাইভ ওয়ার্কশপ", "live workshops")}
              </p>
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
          eyebrow={pick(locale, "লার্নার রিভিউ", "Learner reviews")}
          title={pick(locale, "শিক্ষার্থীরা নিজের ভাষায় যা বলছেন", "What learners say in their own words")}
          description={pick(
            locale,
            "কোর্স শেষে তাদের কাজে কী বদলাল — সেটাই আসল প্রমাণ।",
            "What changed in their work after the course — that is the real proof."
          )}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reviews(locale).map((review) => (
            <article
              key={review.name}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[6px_8px_0_rgba(9,14,22,0.06)]"
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
          {pick(
            locale,
            "*পোর্ট্রেটগুলো AI-জেনারেটেড, বাস্তব ব্যক্তির ছবি নয়।",
            "*Portraits are AI-generated, not photos of real people."
          )}
        </p>
      </section>

      <section id="featured" className="border-y border-line bg-surface-2/50 py-14 lg:py-20">
        <div className="container-cn">
          <SectionHeading
            eyebrow={pick(locale, "জনপ্রিয় কোর্স", "Popular courses")}
            title={pick(locale, "বাছাই করা কোর্স", "Handpicked courses")}
            description={pick(
              locale,
              "নতুনদের জন্য সহজ ভাষায় সাজানো, প্রজেক্ট-বেসড কারিকুলাম। যেকোনো একটি দিয়ে শুরু করুন।",
              "A project-based curriculum written in plain language for beginners. Start with any one of them."
            )}
            href="/courses"
            linkLabel={pick(locale, "সব কোর্স", "All courses")}
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
        <div className="banner-gradient relative overflow-hidden rounded-3xl border-2 border-navy text-cream">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border-[24px] border-cream/5" />
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange/50 bg-orange/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-orange">
                {pick(locale, "রেকর্ডেড · AI", "Recorded · AI")}
              </span>
              <h2 className="section-title mt-4 text-3xl md:text-[2.4rem]">
                {pick(locale, "এখন AI পাওয়ার-ইউজার হয়ে উঠুন", "Become an AI power user today")}
              </h2>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-cream/70">
                {aiCourse.subtitle}
                {pick(
                  locale,
                  " — প্রম্পট থেকে অটোমেশন পর্যন্ত, প্রতিদিনের কাজে সরাসরি ব্যবহার করার মতো ওয়ার্কফ্লো।",
                  " — from prompts to automation, workflows you can put straight to work every day."
                )}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[
                  pick(
                    locale,
                    "প্রম্পট ফাউন্ডেশন থেকে অ্যাডভান্সড টেকনিক",
                    "From prompt foundations to advanced techniques"
                  ),
                  pick(locale, "ChatGPT, Claude ও Gemini একসাথে", "ChatGPT, Claude and Gemini, all in one"),
                  pick(
                    locale,
                    "রিপোর্ট, কনটেন্ট আর অফিস ওয়ার্কফ্লো অটোমেশন",
                    "Reports, content and office workflow automation"
                  ),
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
                    {formatNumber(aiCourse.curriculum.length, locale)}
                  </p>
                  <p className="text-[0.65rem] text-cream/60">{pick(locale, "মডিউল", "modules")}</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-orange">
                    {formatNumber(aiCourse.lesson_count, locale)}
                  </p>
                  <p className="text-[0.65rem] text-cream/60">{pick(locale, "লেসন", "lessons")}</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-orange">
                    {pick(locale, "লাইফটাইম", "Lifetime")}
                  </p>
                  <p className="text-[0.65rem] text-cream/60">{pick(locale, "অ্যাক্সেস", "access")}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={`/courses/${aiCourse.slug}`} className="btn btn-primary">
                  {pick(locale, "কোর্সটি দেখুন", "View the course")}
                </Link>
                <span className="text-sm text-cream/60">{formatTaka(aiCourse.price, locale)}</span>
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
            eyebrow={pick(locale, "লার্নিং পাথ", "Learning paths")}
            title={pick(locale, "কোন পথে শিখবেন?", "Which path will you take?")}
            description={pick(
              locale,
              "আপনার লক্ষ্যটা বেছে নিন, বাকিটা আমরা সাজিয়ে দিয়েছি।",
              "Pick your goal — we have already laid out the rest."
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {paths(locale).map((path) => (
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
                  {pick(locale, "দেখুন", "Explore")}
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
          eyebrow={pick(locale, "লাইভ ওয়ার্কশপ", "Live workshops")}
          title={pick(locale, "অল্প সময়ে হাতে-কলমে শিখুন", "Learn hands-on in a short time")}
          description={pick(
            locale,
            "ইনস্ট্রাক্টরের সাথে সরাসরি ক্লাস, প্রশ্ন করার সুযোগ আর রেকর্ডিং অ্যাক্সেস।",
            "Live classes with the instructor, room to ask questions, and access to the recording."
          )}
          href="/workshops"
          linkLabel={pick(
            locale,
            `সব ওয়ার্কশপ (${formatNumber(workshops.length, locale)})`,
            `All workshops (${formatNumber(workshops.length, locale)})`
          )}
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
                    <span className="live-dot !bg-white" /> {pick(locale, "লাইভ", "Live")}
                  </span>
                  <span className="absolute right-2.5 top-2.5 rounded-sm bg-cream/95 px-2 py-0.5 text-[0.62rem] font-bold text-navy">
                    {formatDate(workshop.starts_at, locale)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-orange-deep">
                    {workshop.duration} · {pick(locale, "অনলাইন", "online")}
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
                      <span>
                        {formatNumber(workshop.seats_left, locale)} {pick(locale, "সিট বাকি", "seats left")}
                      </span>
                      <span>
                        {formatNumber(filled, locale)}% {pick(locale, "ভরা", "filled")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3">
                    <span className="font-display font-bold">
                      {workshop.price === 0 ? pick(locale, "ফ্রি", "Free") : formatTaka(workshop.price, locale)}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-sm transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-white">
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
            <span className="eyebrow">{pick(locale, "যেকোনো ডিভাইসে", "On any device")}</span>
            <h2 className="section-title mt-4 text-3xl md:text-[2.4rem]">
              {pick(locale, "আপনার কোর্স এখন পকেটে", "Your course now fits in your pocket")}
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              {pick(
                locale,
                "সকালের বাসে, লাঞ্চ ব্রেকে বা রাতের আড্ডায় — যেখানে খুশি পড়া চালিয়ে যান। প্রোগ্রেস অটো সেভ হয়, তাই কোথাও থেকে শুরু করলেও এগিয়ে থাকবেন।",
                "On the morning bus, on your lunch break or in a late-night adda — keep learning wherever you like. Your progress saves automatically, so you stay ahead wherever you pick up."
              )}
            </p>
            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {[
                pick(locale, "প্রোগ্রেস অটো-সেভ", "Progress auto-save"),
                pick(locale, "লেসন নোট ও রিসোর্স", "Lesson notes and resources"),
                pick(locale, "যাচাইযোগ্য সার্টিফিকেট", "Verifiable certificate"),
                pick(locale, "মোবাইল ও ডেস্কটপে ফাস্ট", "Fast on mobile and desktop"),
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
                {pick(locale, "আজই এনরোল করুন", "Enrol today")}
              </Link>
              <Link href="/login" className="btn btn-outline">
                {pick(locale, "লগইন করুন", "Log in")}
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
                    <span>
                      {formatNumber(9, locale)}:{formatNumber(41, locale)}
                    </span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cream/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cream/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                    </span>
                  </div>
                  <p className="mt-4 text-[0.65rem] uppercase tracking-widest text-orange">
                    {pick(locale, "আমার ড্যাশবোর্ড", "My dashboard")}
                  </p>
                  <p className="font-display text-lg font-bold">
                    {pick(locale, "স্বাগতম, শিক্ষার্থী", "Welcome, learner")}
                  </p>
                </div>
                <div className="-mt-2 space-y-3 p-4">
                  {[
                    {
                      title: pick(locale, "ফুল-স্ট্যাক ওয়েব", "Full-stack web"),
                      progress: 65,
                      color: "bg-orange",
                    },
                    {
                      title: pick(locale, "AI প্রম্পট মাস্টার", "AI prompt master"),
                      progress: 30,
                      color: "bg-green-light",
                    },
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
                        {formatNumber(item.progress, locale)}% {pick(locale, "সম্পন্ন", "complete")}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-xl bg-orange/15 p-3 text-center">
                    <p className="text-[0.65rem] font-semibold text-orange-deep">
                      {pick(locale, "পরবর্তী লেসন: React Basics", "Next lesson: React Basics")}
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
          eyebrow={pick(locale, "রেকর্ডেড কোর্স", "Recorded courses")}
          title={pick(locale, "নিজের সময়ে, নিজের গতিতে", "Your time, your pace")}
          description={pick(
            locale,
            "লাইফটাইম অ্যাক্সেস — একবার এনরোল করলে ভবিষ্যতের আপডেটও পাবেন।",
            "Lifetime access — enrol once and you get every future update too."
          )}
          href="/courses"
          linkLabel={pick(
            locale,
            `সব কোর্স (${formatNumber(allCourses.length, locale)})`,
            `All courses (${formatNumber(allCourses.length, locale)})`
          )}
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
            eyebrow={pick(locale, "ই-বুক লাইব্রেরি", "E-book library")}
            title={pick(locale, "ফোনে বা ল্যাপটপে, যেখানে খুশি পড়ুন", "Read on your phone or laptop, wherever you like")}
            description={pick(
              locale,
              "কম দামে একদম কাজের গাইড — লাইফটাইম অ্যাক্সেসসহ।",
              "Guides that are genuinely useful, at a low price — lifetime access included."
            )}
            href="/ebooks"
            linkLabel={pick(locale, "সব ই-বুক", "All e-books")}
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
                        {pick(locale, "ই-বুক", "E-book")} · {formatNumber(book.pages, locale)}{" "}
                        {pick(locale, "পেজ", "pages")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
                  <div>
                    <p className="text-[0.62rem] text-muted">
                      {pick(locale, "লাইফটাইম অ্যাক্সেস", "Lifetime access")}
                    </p>
                    <p className="font-display font-bold">
                      {book.price === 0 ? pick(locale, "ফ্রি", "Free") : formatTaka(book.price, locale)}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-sm transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-white">
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
          <div className="relative overflow-hidden rounded-3xl border-2 border-navy bg-cream text-navy shadow-[8px_10px_0_rgba(9,14,22,0.9)] dark:bg-navy-2 dark:text-cream dark:shadow-none">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-[22px] border-orange/40" />
            <div className="pointer-events-none absolute -bottom-10 right-1/4 font-mono text-[7rem] font-bold leading-none text-navy/5 dark:text-cream/5">
              {"</>"}
            </div>
            <div className="relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-orange px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white">
                  {pick(locale, "বান্ডেল · সেরা মূল্য", "Bundle · Best value")}
                </span>
                <h2 className="section-title mt-3 text-3xl md:text-[2.3rem]">
                  {bundle.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted dark:text-cream/70">
                  {bundle.description}
                  {pick(
                    locale,
                    " একবার পেমেন্টে সব কোর্স, ভবিষ্যতের নতুন কোর্সও একই অ্যাক্সেসে।",
                    " One payment for every course, with future releases on the same access."
                  )}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="font-display text-3xl font-bold">
                    {formatTaka(bundle.price, locale)}
                  </span>
                  <span className="text-sm text-muted line-through dark:text-cream/50">
                    {formatTaka(bundle.original_price, locale)}
                  </span>
                  <span className="rounded-md bg-green/10 px-2 py-0.5 text-xs font-bold text-green">
                    {formatNumber(discountPercent(bundle.price, bundle.original_price), locale)}%{" "}
                    {pick(locale, "ছাড়", "off")}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/checkout/bundle/${bundle.id}`} className="btn btn-primary">
                    {pick(locale, "বান্ডেলটি নিন", "Get the bundle")}
                  </Link>
                  <Link href="/bundles" className="btn btn-outline">
                    {pick(locale, "সব বান্ডেল", "All bundles")}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-surface/70 p-5 dark:border-cream/10 dark:bg-cream/5">
                {[
                  pick(
                    locale,
                    `${formatNumber(allCourses.length, locale)}টি কোর্স একসাথে`,
                    `${formatNumber(allCourses.length, locale)} courses in one go`
                  ),
                  pick(locale, "ভবিষ্যতের কোর্স আপডেট", "Future course updates"),
                  pick(locale, "লাইফটাইম অ্যাক্সেস", "Lifetime access"),
                  pick(locale, "সার্টিফিকেট অন্তর্ভুক্ত", "Certificate included"),
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
        <div className="relative overflow-hidden rounded-3xl border-2 border-navy bg-orange px-6 py-10 text-white sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-[20px] border-white/15" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 font-mono text-[8rem] font-bold leading-none text-white/10">
            {"</>"}
          </div>
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="font-hand text-2xl text-white/80">
                {pick(locale, "শেখা থামিয়ে দেবেন না", "Don't stop learning")}
              </p>
              <h2 className="section-title mt-1 text-3xl md:text-[2.5rem]">
                {pick(
                  locale,
                  "এটা শুধু ভিডিওর লাইব্রেরি না — এটা আপনার শেখার খাতা।",
                  "It isn't just a video library — it's your own learning notebook."
                )}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                {pick(
                  locale,
                  "ছোট লেসন, বাংলায় ব্যাখ্যা, আর এমন স্কিল যা কালকেই কাজে লাগে। আজই প্রথম ধাপটা নিন।",
                  "Short lessons, explanations in Bangla, and skills you can use from tomorrow. Take the first step today."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-dark btn-lg">
                {pick(locale, "ফ্রি অ্যাকাউন্ট খুলুন", "Create a free account")}
              </Link>
              <Link
                href="/courses"
                className="btn btn-outline btn-lg border-white text-white hover:bg-white/10"
              >
                {pick(locale, "কোর্স ব্রাউজ করুন", "Browse courses")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
