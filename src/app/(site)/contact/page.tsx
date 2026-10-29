import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "যোগাযোগ", "Contact"),
    description: pick(
      locale,
      "CrackNcode Academy-র সাথে যোগাযোগ করুন — কোর্স, পেমেন্ট বা যেকোনো প্রশ্নে।",
      "Get in touch with CrackNcode Academy — about courses, payments or any question."
    ),
  };
}

export default async function ContactPage() {
  const locale = await getLocale();

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav
            className="flex items-center gap-2 text-xs text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
            <span>/</span>
            <span className="text-ink">{pick(locale, "যোগাযোগ", "Contact")}</span>
          </nav>
          <span className="eyebrow mt-6">{pick(locale, "সাহায্য দরকার?", "Need help?")}</span>
          <h1 className="section-title mt-3 text-3xl md:text-5xl">
            {pick(locale, "আমরা শুনছি", "We're listening")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {pick(
              locale,
              "কোর্স, পেমেন্ট, অ্যাকাউন্ট বা যেকোনো বিষয়ে প্রশ্ন থাকলে লিখুন। সাধারণত ",
              "If you have a question about courses, payments, your account or anything else, write to us. We usually reply within "
            )}
            {formatNumber(24, locale)}
            {pick(locale, " ঘণ্টার মধ্যে উত্তর দিই।", " hours.")}
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-line-soft bg-surface p-6 md:p-8">
            <h2 className="font-display text-xl font-bold">
              {pick(locale, "মেসেজ পাঠান", "Send a message")}
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted">
              {pick(locale, "ফর্মটি পূরণ করুন — আমরা ইমেইলে উত্তর দেব।", "Fill out the form and we'll reply by email.")}
            </p>
            <ContactForm locale={locale} />
          </div>

          <div className="space-y-4">
            {[
              {
                label: pick(locale, "ইমেইল", "Email"),
                value: "hello@crackncode.academy",
                note: (
                  <>
                    {pick(locale, "সাধারণত ", "Usually replies within ")}
                    {formatNumber(24, locale)}
                    {pick(locale, " ঘণ্টায় উত্তর", " hours")}
                  </>
                ),
              },
              {
                label: pick(locale, "হোয়াটসঅ্যাপ / ফোন", "WhatsApp / Phone"),
                value: "+880 1XXX-XXXXXX",
                note: pick(locale, "রবি-বৃহস্পতি, ১০টা - ৬টা", "Sun–Thu, 10am – 6pm"),
              },
              {
                label: pick(locale, "অফিস", "Office"),
                value: pick(locale, "ঢাকা, বাংলাদেশ", "Dhaka, Bangladesh"),
                note: pick(locale, "দর্শনের আগে অ্যাপয়েন্টমেন্ট নিন", "Please book an appointment before visiting"),
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
              <p className="text-sm font-semibold">
                {pick(locale, "সার্টিফিকেট যাচাই করতে চান?", "Want to verify a certificate?")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {pick(
                  locale,
                  "কোড দিয়ে সাথে সাথে যাচাই করুন — আলাদা মেসেজের দরকার নেই।",
                  "Verify it instantly with the code — no need to send us a separate message."
                )}
              </p>
              <Link href="/verify" className="btn btn-outline btn-sm mt-3">
                {pick(locale, "যাচাই করুন", "Verify now")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
