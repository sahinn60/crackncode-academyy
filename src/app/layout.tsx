import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CrackNcode Academy — সহজ বাংলায় কোডিং ও টেক স্কিল",
    template: "%s | CrackNcode Academy",
  },
  description:
    "বাংলায় প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট, AI ও ফ্রিল্যান্সিং শেখার প্ল্যাটফর্ম। লাইভ ওয়ার্কশপ, রেকর্ডেড কোর্স, প্রজেক্ট ও সার্টিফিকেটসহ।",
  keywords: [
    "কোডিং শেখা",
    "প্রোগ্রামিং কোর্স",
    "ওয়েব ডেভেলপমেন্ট",
    "ফ্রিল্যান্সিং",
    "CrackNcode Academy",
  ],
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('cn-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
