export const LOCALE_COOKIE = "cn_locale";

export type Locale = "bn" | "en";

export const locales: Locale[] = ["bn", "en"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "bn" || value === "en";
}

export function pick<T>(locale: Locale, bn: T, en: T): T {
  return locale === "en" ? en : bn;
}

export function localeTag(locale: Locale): string {
  return locale === "en" ? "en-US" : "bn-BD";
}

const CATEGORY_EN: Record<string, string> = {
  "ওয়েব ডেভেলপমেন্ট": "Web Development",
  প্রোগ্রামিং: "Programming",
  AI: "AI",
  ফ্রিল্যান্সিং: "Freelancing",
  "সাইবার সিকিউরিটি": "Cyber Security",
  ডাটা: "Data",
  ডিজাইন: "Design",
  ক্যারিয়ার: "Career",
  টুলস: "Tools",
  "শুরু করা": "Getting Started",
};

export function categoryLabel(category: string, locale: Locale): string {
  if (locale === "bn") return category;
  return CATEGORY_EN[category] ?? category;
}

const LEVEL_EN: Record<string, string> = {
  বিগিনার: "Beginner",
  ইন্টারমিডিয়েট: "Intermediate",
  অ্যাডভান্সড: "Advanced",
};

export function levelLabel(level: string, locale: Locale): string {
  if (locale === "bn") return level;
  return LEVEL_EN[level] ?? level;
}
