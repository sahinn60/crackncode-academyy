import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: {
      default: pick(
        locale,
        "CrackNcode Academy — সহজ বাংলায় কোডিং ও টেক স্কিল",
        "CrackNcode Academy — Coding and tech skills in plain Bangla"
      ),
      template: "%s | CrackNcode Academy",
    },
    description: pick(
      locale,
      "বাংলায় প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট, AI ও ফ্রিল্যান্সিং শেখার প্ল্যাটফর্ম। লাইভ ওয়ার্কশপ, রেকর্ডেড কোর্স, প্রজেক্ট ও সার্টিফিকেটসহ।",
      "Learn programming, web development, AI and freelancing in Bangla. Live workshops, recorded courses, projects and certificates."
    ),
    keywords: pick(
      locale,
      ["কোডিং শেখা", "প্রোগ্রামিং কোর্স", "ওয়েব ডেভেলপমেন্ট", "ফ্রিল্যান্সিং", "CrackNcode Academy"],
      ["learn coding", "programming course", "web development", "freelancing", "CrackNcode Academy"]
    ),
  };
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('cn-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
