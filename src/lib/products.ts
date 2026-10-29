import "server-only";
import { getBundleById, getBundleCourses, getCourseById, getEbookById, getWorkshopById } from "./data";
import { getLocale } from "./i18n-server";
import { pick } from "./i18n";
import { formatNumber } from "./utils";

export type CheckoutType = "course" | "bundle" | "ebook" | "workshop";

export type CheckoutProduct = {
  type: CheckoutType;
  id: number;
  slug: string;
  title: string;
  amount: number;
  originalPrice: number;
  gradient: string;
  icon: string;
  image?: string;
  meta: string;
  courseIds: number[];
};

export async function getCheckoutProduct(
  type: string,
  id: number
): Promise<CheckoutProduct | null> {
  const locale = await getLocale();
  if (type === "course") {
    const c = await getCourseById(id);
    if (!c || !c.published) return null;
    return {
      type: "course",
      id: c.id,
      slug: c.slug,
      title: c.title,
      amount: c.price,
      originalPrice: c.original_price,
      gradient: c.gradient,
      icon: c.icon,
      image: c.image,
      meta: pick(
        locale,
        `${formatNumber(c.lesson_count, locale)}টি লেসন • ${formatNumber(c.hours, locale)} ঘণ্টা`,
        `${formatNumber(c.lesson_count, locale)} lessons • ${formatNumber(c.hours, locale)} hours`
      ),
      courseIds: [c.id],
    };
  }
  if (type === "bundle") {
    const b = await getBundleById(id);
    if (!b) return null;
    const courses = await getBundleCourses(b);
    return {
      type: "bundle",
      id: b.id,
      slug: b.slug,
      title: b.title,
      amount: b.price,
      originalPrice: b.original_price,
      gradient: b.gradient,
      icon: "PKG",
      meta: pick(
        locale,
        `${formatNumber(courses.length, locale)}টি কোর্স একসাথে`,
        `${formatNumber(courses.length, locale)} courses together`
      ),
      courseIds: courses.map((c) => c.id),
    };
  }
  if (type === "ebook") {
    const e = await getEbookById(id);
    if (!e) return null;
    return {
      type: "ebook",
      id: e.id,
      slug: e.slug,
      title: e.title,
      amount: e.price,
      originalPrice: 0,
      gradient: e.gradient,
      icon: "PDF",
      meta: pick(
        locale,
        `${formatNumber(e.pages, locale)} পেজ`,
        `${formatNumber(e.pages, locale)} pages`
      ),
      courseIds: [],
    };
  }
  if (type === "workshop") {
    const w = await getWorkshopById(id);
    if (!w) return null;
    return {
      type: "workshop",
      id: w.id,
      slug: w.slug,
      title: w.title,
      amount: w.price,
      originalPrice: 0,
      gradient: w.gradient,
      icon: "LIVE",
      image: w.image,
      meta: pick(locale, `${w.duration} • লাইভ অনলাইন`, `${w.duration} • live online`),
      courseIds: [],
    };
  }
  return null;
}

export function productHref(type: string, slug: string): string {
  if (type === "course") return `/courses/${slug}`;
  if (type === "bundle") return "/bundles";
  if (type === "ebook") return "/ebooks";
  if (type === "workshop") return "/workshops";
  return "/";
}
