import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "রিফান্ড নীতি", "Refund Policy") };
}

export default async function RefundPage() {
  const locale = await getLocale();

  return (
    <LegalPage
      title={pick(locale, "রিফান্ড নীতি", "Refund Policy")}
      updated={pick(locale, "২৬ অক্টোবর ২০২৬", "26 October 2026")}
      intro={pick(
        locale,
        "আমরা চাই আপনি সন্তুষ্ট থাকুন। কোনো কোর্স প্রত্যাশার সাথে না মিললে নির্দিষ্ট সময়ের মধ্যে রিফান্ডের আবেদন করতে পারবেন।",
        "We want you to be satisfied. If a course does not meet your expectations, you can request a refund within the specified period."
      )}
      sections={[
        {
          heading: pick(locale, "রিফান্ডের সময়সীমা", "Refund window"),
          body: [
            pick(
              locale,
              "কোর্স কেনার ৭ দিনের মধ্যে এবং কোর্সের ২০%-এর কম কনটেন্ট দেখা হয়ে থাকলে রিফান্ডের আবেদন করা যাবে।",
              "You may request a refund within 7 days of purchasing a course, provided you have viewed less than 20% of its content."
            ),
            pick(
              locale,
              "ই-বুক ডিজিটাল ডাউনলোডযোগ্য পণ্য হওয়ায় ডাউনলোডের পর সাধারণত রিফান্ডযোগ্য নয়।",
              "E-books are digital downloadable products, so they are generally not refundable once downloaded."
            ),
          ],
        },
        {
          heading: pick(locale, "কীভাবে আবেদন করবেন", "How to apply"),
          body: [
            pick(
              locale,
              "যোগাযোগ পেজ থেকে আপনার অর্ডার নম্বর বা ট্রানজেকশন আইডি দিয়ে রিফান্ডের অনুরোধ জানান।",
              "Send a refund request from the contact page with your order number or transaction ID."
            ),
            pick(
              locale,
              "আবেদন যাচাই করে ৭ কার্যদিবসের মধ্যে সিদ্ধান্ত জানানো হয়। অনুমোদিত হলে মূল পেমেন্ট মাধ্যমে ফেরত পাঠানো হয়।",
              "We review the request and inform you of our decision within 7 business days. If approved, the amount is returned through the original payment method."
            ),
          ],
        },
        {
          heading: pick(locale, "যেসব ক্ষেত্রে রিফান্ড প্রযোজ্য নয়", "When refunds do not apply"),
          body: [
            pick(
              locale,
              "কোর্সের ২০%-এর বেশি দেখা হয়ে গেলে, সার্টিফিকেট নেওয়া হয়ে গেলে বা ডাউনলোড করা রিসোর্স ব্যবহার করা হলে।",
              "If more than 20% of the course has been viewed, the certificate has already been received, or downloaded resources have been used."
            ),
            pick(
              locale,
              "অ্যাকাউন্ট শেয়ার, কনটেন্ট পুনর্বিক্রি বা শর্ত লঙ্ঘনের কারণে অ্যাকাউন্ট বন্ধ করা হলে।",
              "If the account has been closed due to account sharing, reselling content or a violation of the terms."
            ),
          ],
        },
        {
          heading: pick(locale, "প্রযুক্তিগত সমস্যা", "Technical issues"),
          body: [
            pick(
              locale,
              "কোর্সে অ্যাক্সেস পাচ্ছেন না বা ভিডিও চালু হচ্ছে না — এমন হলে আগে আমাদের জানান। বেশিরভাগ সমস্যা দ্রুত সমাধান করা সম্ভব।",
              "If you cannot access a course or a video will not play, let us know first. Most issues can be resolved quickly."
            ),
            pick(
              locale,
              "সমস্যা সমাধান না হলে এবং আপনার অভিজ্ঞতা প্রত্যাশার সাথে না মিললে রিফান্ড প্রক্রিয়া বিবেচনা করা হবে।",
              "If the issue cannot be resolved and your experience still falls short of your expectations, the refund process will be considered."
            ),
          ],
        },
        {
          heading: pick(locale, "যোগাযোগ", "Contact"),
          body: [
            pick(
              locale,
              "রিফান্ড সংক্রান্ত যেকোনো প্রশ্নে যোগাযোগ পেজে মেসেজ দিন। অর্ডার আইডি দিলে দ্রুত ব্যবস্থা নেওয়া সহজ হয়।",
              "For any refund-related questions, send us a message on the contact page. Including your order ID helps us act more quickly."
            ),
          ],
        },
      ]}
    />
  );
}
