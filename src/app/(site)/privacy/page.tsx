import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "প্রাইভেসি পলিসি", "Privacy Policy") };
}

export default async function PrivacyPage() {
  const locale = await getLocale();

  return (
    <LegalPage
      title={pick(locale, "প্রাইভেসি পলিসি", "Privacy Policy")}
      updated={pick(locale, "২৬ অক্টোবর ২০২৬", "26 October 2026")}
      intro={pick(
        locale,
        "আপনার তথ্য আপনার। CrackNcode Academy কী তথ্য সংগ্রহ করে, কেন করে এবং কীভাবে সুরক্ষিত রাখে — সংক্ষেপে এখানে বলা হয়েছে।",
        "Your information is yours. Here is a brief look at what information CrackNcode Academy collects, why we collect it, and how we keep it safe."
      )}
      sections={[
        {
          heading: pick(locale, "আমরা কী তথ্য সংগ্রহ করি", "What information we collect"),
          body: [
            pick(
              locale,
              "অ্যাকাউন্ট খোলার সময় নাম, ইমেইল এবং ঐচ্ছিকভাবে মোবাইল নম্বর নেওয়া হয়। কেউ কোর্স কিনলে অর্ডার, পেমেন্ট মাধ্যম ও লেনদেনের রেফারেন্স সংরক্ষণ করা হয়।",
              "When you create an account, we collect your name, email address and, optionally, your mobile number. When you buy a course, we store the order, the payment method and the transaction reference."
            ),
            pick(
              locale,
              "কোর্সের ভেতরে কোন লেসন সম্পন্ন হয়েছে, সেই অগ্রগতির তথ্য সংরক্ষণ করা হয় যাতে আপনি যেকোনো ডিভাইস থেকে ঠিক জায়গা থেকে শুরু করতে পারেন।",
              "We also keep track of which lessons you have completed inside a course so that you can pick up exactly where you left off from any device."
            ),
          ],
        },
        {
          heading: pick(locale, "তথ্য কীভাবে ব্যবহার করা হয়", "How we use your information"),
          body: [
            pick(
              locale,
              "অ্যাকাউন্ট চালানো, কোর্সে অ্যাক্সেস দেওয়া, সার্টিফিকেট ইস্যু করা এবং সহায়তার অনুরোধের উত্তর দিতে তথ্য ব্যবহার করা হয়।",
              "We use your information to run your account, grant access to courses, issue certificates and respond to support requests."
            ),
            pick(
              locale,
              "আপনি সাবস্ক্রাইব করলে নতুন কোর্স বা ওয়ার্কশপের আপডেট ইমেইলে পাঠানো হতে পারে। চাইলে যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।",
              "If you subscribe, we may email you updates about new courses or workshops. You can unsubscribe at any time."
            ),
          ],
        },
        {
          heading: pick(locale, "পেমেন্ট তথ্য", "Payment information"),
          body: [
            pick(
              locale,
              "পেমেন্ট প্রসেসিং সংশ্লিষ্ট পেমেন্ট গেটওয়ে (যেমন bKash বা Nagad) নিজে পরিচালনা করে। আমরা আপনার কার্ড নম্বর, পিন বা পূর্ণ পেমেন্ট ক্রেডেনশিয়াল সংরক্ষণ করি না।",
              "Payment processing is handled directly by the relevant payment gateway (such as bKash or Nagad). We do not store your card number, PIN or full payment credentials."
            ),
            pick(
              locale,
              "আমাদের কাছে শুধু অর্ডারের পরিমাণ, মাধ্যম, স্ট্যাটাস ও ট্রানজেকশন আইডি থাকে — যাতে প্রয়োজনে পেমেন্ট যাচাই করা যায়।",
              "We only keep the order amount, payment method, status and transaction ID, so that payments can be verified when needed."
            ),
          ],
        },
        {
          heading: pick(locale, "কুকিজ", "Cookies"),
          body: [
            pick(
              locale,
              "লগইন সেশন চালু রাখতে আমরা প্রয়োজনীয় কুকি ব্যবহার করি। থিম পছন্দের মতো কিছু সেটিংস আপনার ব্রাউজারেই সংরক্ষিত থাকে।",
              "We use essential cookies to keep your login session active. Some settings, such as your theme preference, are stored in your browser itself."
            ),
          ],
        },
        {
          heading: pick(locale, "আপনার অধিকার", "Your rights"),
          body: [
            pick(
              locale,
              "আপনি আপনার অ্যাকাউন্টের নাম ও যোগাযোগের তথ্য ড্যাশবোর্ড থেকে আপডেট করতে পারেন। অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে চাইলে যোগাযোগ করুন।",
              "You can update your account name and contact details from your dashboard. If you would like to request that your account be deleted, please contact us."
            ),
            pick(
              locale,
              "আইনগত কারণে কিছু অর্ডার ও লেনদেনের রেকর্ড নির্দিষ্ট সময় পর্যন্ত সংরক্ষণ করতে হতে পারে।",
              "For legal reasons, we may need to retain certain order and transaction records for a specified period."
            ),
          ],
        },
      ]}
    />
  );
}
