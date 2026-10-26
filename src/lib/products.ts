import "server-only";
import { getBundleById, getBundleCourses, getCourseById, getEbookById, getWorkshopById } from "./data";

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

export function getCheckoutProduct(type: string, id: number): CheckoutProduct | null {
  if (type === "course") {
    const c = getCourseById(id);
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
      meta: `${c.lesson_count}টি লেসন • ${c.hours} ঘণ্টা`,
      courseIds: [c.id],
    };
  }
  if (type === "bundle") {
    const b = getBundleById(id);
    if (!b) return null;
    const courses = getBundleCourses(b);
    return {
      type: "bundle",
      id: b.id,
      slug: b.slug,
      title: b.title,
      amount: b.price,
      originalPrice: b.original_price,
      gradient: b.gradient,
      icon: "PKG",
      meta: `${courses.length}টি কোর্স একসাথে`,
      courseIds: courses.map((c) => c.id),
    };
  }
  if (type === "ebook") {
    const e = getEbookById(id);
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
      meta: `${e.pages} পেজ`,
      courseIds: [],
    };
  }
  if (type === "workshop") {
    const w = getWorkshopById(id);
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
      meta: `${w.duration} • লাইভ অনলাইন`,
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
