import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "ব্যবহারের শর্ত", "Terms of Use") };
}

export default async function TermsPage() {
  const locale = await getLocale();

  return (
    <LegalPage
      title={pick(locale, "ব্যবহারের শর্ত", "Terms of Use")}
      updated={pick(locale, "২৬ অক্টোবর ২০২৬", "26 October 2026")}
      intro={pick(
        locale,
        "CrackNcode Academy ব্যবহার করার আগে এই শর্তগুলো পড়ে নিন। অ্যাকাউন্ট খোলা বা কোর্স কেনার অর্থ হলো আপনি এই শর্তগুলোতে সম্মত।",
        "Please read these terms before using CrackNcode Academy. By creating an account or buying a course, you agree to these terms."
      )}
      sections={[
        {
          heading: pick(locale, "অ্যাকাউন্টের দায়িত্ব", "Account responsibility"),
          body: [
            pick(
              locale,
              "আপনার অ্যাকাউন্টের পাসওয়ার্ড গোপন রাখার দায়িত্ব আপনার। আপনার অ্যাকাউন্ট থেকে হওয়া কার্যকলাপের জন্য আপনি দায়ী।",
              "You are responsible for keeping your account password confidential. You are also responsible for all activity that takes place under your account."
            ),
            pick(
              locale,
              "ভুল বা ভুয়া তথ্য দিয়ে অ্যাকাউন্ট খোলা যাবে না। একাধিক ব্যক্তির সাথে একই অ্যাকাউন্ট শেয়ার করা নিষিদ্ধ।",
              "You may not open an account with false or inaccurate information. Sharing a single account with multiple people is prohibited."
            ),
          ],
        },
        {
          heading: pick(locale, "কোর্স ও কনটেন্টের ব্যবহার", "Use of courses and content"),
          body: [
            pick(
              locale,
              "কোর্সের ভিডিও, নোট, টেমপ্লেট ও অন্যান্য উপকরণ শুধু আপনার ব্যক্তিগত শেখার জন্য। এগুলো ডাউনলোড করে পুনরায় বিক্রি, বিতরণ বা পাবলিকভাবে শেয়ার করা যাবে না।",
              "Course videos, notes, templates and other materials are for your personal learning only. They may not be downloaded and then resold, distributed or shared publicly."
            ),
            pick(
              locale,
              "কোর্সের কনটেন্ট অনুমতি ছাড়া রেকর্ড, স্ক্রিনশট করে প্রকাশ বা অন্য কারো নামে ব্যবহার করা লঙ্ঘন হিসেবে গণ্য হবে।",
              "Recording or screenshotting course content and publishing it, or using it under someone else's name, without permission will be treated as a violation."
            ),
          ],
        },
        {
          heading: pick(locale, "পেমেন্ট ও অ্যাক্সেস", "Payments and access"),
          body: [
            pick(
              locale,
              "কোর্সের দাম ওয়েবসাইটে দেখানো দাম অনুযায়ী। পেমেন্ট সফল হলে আপনার ড্যাশবোর্ডে কোর্স অ্যাক্সেস চালু হয়।",
              "Course prices are as shown on the website. Once your payment is successful, access to the course is activated in your dashboard."
            ),
            pick(
              locale,
              "কিছু ক্ষেত্রে পেমেন্ট যাচাই করতে সময় লাগতে পারে। সমস্যা হলে ট্রানজেকশন আইডি দিয়ে যোগাযোগ করুন।",
              "In some cases, payment verification may take some time. If you run into a problem, contact us with your transaction ID."
            ),
          ],
        },
        {
          heading: pick(locale, "আচরণবিধি", "Code of conduct"),
          body: [
            pick(
              locale,
              "কমিউনিটি বা ক্লাসে অন্যকে বিরক্ত করা, হয়রানি করা, বর্ণবাদী বা আপত্তিকর আচরণ করা যাবে না।",
              "Disturbing or harassing others in the community or in classes, or engaging in racist or offensive behaviour, is not allowed."
            ),
            pick(
              locale,
              "যেকোনো সন্দেহজনক বা ক্ষতিকর কার্যকলাপ পাওয়া গেলে অ্যাকাউন্ট স্থগিত করা হতে পারে।",
              "Accounts may be suspended if any suspicious or harmful activity is detected."
            ),
          ],
        },
        {
          heading: pick(locale, "পরিবর্তন", "Changes"),
          body: [
            pick(
              locale,
              "কোর্স, দাম বা এই শর্তগুলো সময় সময় আপডেট হতে পারে। গুরুত্বপূর্ণ পরিবর্তনের বিষয়ে ওয়েবসাইট বা ইমেইলে জানানো হবে।",
              "Courses, prices and these terms may be updated from time to time. We will announce significant changes on the website or by email."
            ),
          ],
        },
      ]}
    />
  );
}
