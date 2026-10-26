import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: "CrackNcode Academy-র সাথে যোগাযোগ করুন — কোর্স, পেমেন্ট বা যেকোনো প্রশ্নে।",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">যোগাযোগ</span>
          </nav>
          <span className="eyebrow mt-6">সাহায্য দরকার?</span>
          <h1 className="section-title mt-3 text-3xl md:text-5xl">আমরা শুনছি</h1>
          <p className="mt-3 max-w-2xl text-muted">
            কোর্স, পেমেন্ট, অ্যাকাউন্ট বা যেকোনো বিষয়ে প্রশ্ন থাকলে লিখুন। সাধারণত ২৪
            ঘণ্টার মধ্যে উত্তর দিই।
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-line-soft bg-surface p-6 md:p-8">
            <h2 className="font-display text-xl font-bold">মেসেজ পাঠান</h2>
            <p className="mt-1 mb-6 text-sm text-muted">
              ফর্মটি পূরণ করুন — আমরা ইমেইলে উত্তর দেব।
            </p>
            <ContactForm />
          </div>

          <div className="space-y-4">
            {[
              {
                label: "ইমেইল",
                value: "hello@crackncode.academy",
                note: "সাধারণত ২৪ ঘণ্টায় উত্তর",
              },
              {
                label: "হোয়াটসঅ্যাপ / ফোন",
                value: "+880 1XXX-XXXXXX",
                note: "রবি-বৃহস্পতি, ১০টা - ৬টা",
              },
              {
                label: "অফিস",
                value: "ঢাকা, বাংলাদেশ",
                note: "দর্শনের আগে অ্যাপয়েন্টমেন্ট নিন",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line-soft bg-surface p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-lg font-bold">{item.value}</p>
                <p className="mt-0.5 text-xs text-muted">{item.note}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-orange/40 bg-orange/10 p-5">
              <p className="text-sm font-semibold">সার্টিফিকেট যাচাই করতে চান?</p>
              <p className="mt-1 text-xs text-muted">
                কোড দিয়ে সাথে সাথে যাচাই করুন — আলাদা মেসেজের দরকার নেই।
              </p>
              <Link href="/verify" className="btn btn-outline btn-sm mt-3">
                যাচাই করুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
