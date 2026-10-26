import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="eyebrow">৪০৪</span>
      <h1 className="section-title mt-4 text-4xl md:text-6xl">পেজটা খুঁজে পাচ্ছি না</h1>
      <p className="mt-3 max-w-md text-muted">
        লিংকটা হয়তো পুরোনো, নাহলে পেজটা সরিয়ে ফেলা হয়েছে। নিচের যেকোনো একটি অপশন থেকে
        শুরু করুন।
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">হোমে ফিরুন</Link>
        <Link href="/courses" className="btn btn-outline">কোর্স দেখুন</Link>
      </div>
      <p className="mt-10 font-mono text-xs text-muted">{"// 404 page not found"}</p>
    </div>
  );
}
