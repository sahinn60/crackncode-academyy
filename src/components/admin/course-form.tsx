"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveCourseAction } from "@/lib/admin-actions";
import { categoryLabel, levelLabel, pick, type Locale } from "@/lib/i18n";
import { formatNumber, slugify } from "@/lib/utils";
import type { Module } from "@/lib/types";

type FormCourse = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  hours: number;
  price: number;
  original_price: number;
  gradient: string;
  icon: string;
  featured: number;
  published: number;
  instructor_name: string;
  instructor_title: string;
  instructor_bio: string;
  outcomes: string[];
  curriculum: Module[];
};

const presets: { label: (locale: Locale) => string; value: string }[] = [
  {
    label: (locale) => pick(locale, "ওয়েব", "ওয়েব"),
    value: "linear-gradient(135deg,#090E16 0%,#47000E 45%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "পাইথন", "পাইথন"),
    value: "linear-gradient(135deg,#47000E 0%,#B80022 55%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "AI", "AI"),
    value: "linear-gradient(135deg,#090E16 0%,#B80022 60%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "রিঅ্যাক্ট", "রিঅ্যাক্ট"),
    value: "linear-gradient(135deg,#10131C 0%,#47000E 50%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "কনটেস্ট", "কনটেস্ট"),
    value: "linear-gradient(135deg,#47000E 0%,#ED002B 70%,#10131C 100%)",
  },
  {
    label: (locale) => pick(locale, "ফ্রিল্যান্স", "ফ্রিল্যান্স"),
    value: "linear-gradient(160deg,#090E16 0%,#47000E 55%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "সিকিউরিটি", "সিকিউরিটি"),
    value: "linear-gradient(135deg,#10131C 0%,#47000E 45%,#B80022 100%)",
  },
  {
    label: (locale) => pick(locale, "ডাটা", "ডাটা"),
    value: "linear-gradient(150deg,#47000E 0%,#B80022 55%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "ফ্লাটার", "ফ্লাটার"),
    value: "linear-gradient(135deg,#090E16 0%,#ED002B 60%,#47000E 100%)",
  },
  {
    label: (locale) => pick(locale, "ডিজাইন", "ডিজাইন"),
    value: "linear-gradient(135deg,#ED002B 0%,#B80022 55%,#090E16 100%)",
  },
  {
    label: (locale) => pick(locale, "ডেভঅপস", "ডেভঅপস"),
    value: "linear-gradient(135deg,#090E16 0%,#10131C 45%,#ED002B 100%)",
  },
  {
    label: (locale) => pick(locale, "ওয়ার্ডপ্রেস", "ওয়ার্ডপ্রেস"),
    value: "linear-gradient(135deg,#47000E 0%,#10131C 55%,#B80022 100%)",
  },
];

const emptyModule = (): Module => ({
  title: "",
  lessons: [{ title: "", minutes: 10, summary: "" }],
});

function SubmitButton({ isEdit, locale }: { isEdit: boolean; locale: Locale }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending
        ? pick(locale, "সংরক্ষণ হচ্ছে...", "Saving...")
        : isEdit
          ? pick(locale, "পরিবর্তন সংরক্ষণ করুন", "Save changes")
          : pick(locale, "কোর্স তৈরি করুন", "Create course")}
    </button>
  );
}

export function CourseForm({ locale, course }: { locale: Locale; course?: FormCourse }) {
  const [state, formAction] = useActionState(saveCourseAction, null);
  const isEdit = Boolean(course);
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [gradient, setGradient] = useState(course?.gradient ?? presets[0].value);
  const [modules, setModules] = useState<Module[]>(
    course?.curriculum?.length ? course.curriculum : [emptyModule()]
  );

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const updateModule = (mi: number, patch: Partial<Module>) => {
    setModules((prev) => prev.map((m, i) => (i === mi ? { ...m, ...patch } : m)));
  };

  const updateLesson = (
    mi: number,
    li: number,
    patch: Partial<Module["lessons"][number]>
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === mi
          ? {
              ...m,
              lessons: m.lessons.map((l, j) => (j === li ? { ...l, ...patch } : l)),
            }
          : m
      )
    );
  };

  const addModule = () =>
    setModules((prev) => [...prev, { title: "", lessons: [{ title: "", minutes: 10, summary: "" }] }]);

  const removeModule = (mi: number) =>
    setModules((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== mi)));

  const addLesson = (mi: number) =>
    setModules((prev) =>
      prev.map((m, i) =>
        i === mi ? { ...m, lessons: [...m.lessons, { title: "", minutes: 10, summary: "" }] } : m
      )
    );

  const removeLesson = (mi: number, li: number) =>
    setModules((prev) =>
      prev.map((m, i) =>
        i === mi
          ? { ...m, lessons: m.lessons.length === 1 ? m.lessons : m.lessons.filter((_, j) => j !== li) }
          : m
      )
    );

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const outcomeCount = course?.outcomes.length ?? 0;

  return (
    <form action={formAction} className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      {course && <input type="hidden" name="id" value={course.id} />}
      <input type="hidden" name="curriculum" value={JSON.stringify(modules)} />
      <input type="hidden" name="gradient" value={gradient} />

      <div className="space-y-6">
        {state?.error && (
          <div className="rounded-xl border border-live/40 bg-live/10 px-4 py-3 text-sm text-live">
            {state.error}
          </div>
        )}

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">
            {pick(locale, "মূল তথ্য", "Basic information")}
          </h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="label" htmlFor="title">
                {pick(locale, "কোর্সের নাম", "Course title")}
              </label>
              <input
                id="title"
                name="title"
                className="input"
                required
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder={pick(
                  locale,
                  "যেমন: Next.js দিয়ে ফুল-স্ট্যাক অ্যাপ",
                  "e.g. Full-stack apps with Next.js"
                )}
              />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                {pick(locale, "স্লাগ (URL)", "Slug (URL)")}
              </label>
              <input
                id="slug"
                name="slug"
                className="input font-mono text-sm"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="nextjs-fullstack"
              />
              <p className="mt-1 text-[0.68rem] text-muted">
                {pick(
                  locale,
                  `পাবলিক লিংক: /courses/${slug || "..."} — ইংরেজি ছোট হাতের অক্ষর ব্যবহার করুন।`,
                  `Public link: /courses/${slug || "..."} — use lowercase English letters.`
                )}
              </p>
            </div>
            <div>
              <label className="label" htmlFor="subtitle">
                {pick(locale, "সংক্ষিপ্ত বর্ণনা", "Short description")}
              </label>
              <input
                id="subtitle"
                name="subtitle"
                className="input"
                required
                defaultValue={course?.subtitle ?? ""}
                placeholder={pick(
                  locale,
                  "এক বাক্যে কোর্সটি কী শেখাবে",
                  "Describe what the course teaches in one sentence"
                )}
              />
            </div>
            <div>
              <label className="label" htmlFor="description">
                {pick(locale, "বিস্তারিত বিবরণ", "Full description")}
              </label>
              <textarea
                id="description"
                name="description"
                className="input min-h-36"
                required
                defaultValue={course?.description ?? ""}
                placeholder={pick(
                  locale,
                  "কোর্সে কী কী থাকবে, কার জন্য উপযোগী ইত্যাদি লিখুন...",
                  "What the course covers, who it is for, and so on..."
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="category">
                  {pick(locale, "ক্যাটাগরি", "Category")}
                </label>
                <input
                  id="category"
                  name="category"
                  className="input"
                  required
                  defaultValue={course?.category ?? ""}
                  list="category-options"
                  placeholder={categoryLabel("ওয়েব ডেভেলপমেন্ট", locale)}
                />
                <datalist id="category-options">
                  <option value="ওয়েব ডেভেলপমেন্ট">
                    {categoryLabel("ওয়েব ডেভেলপমেন্ট", locale)}
                  </option>
                  <option value="প্রোগ্রামিং">{categoryLabel("প্রোগ্রামিং", locale)}</option>
                  <option value="AI">{categoryLabel("AI", locale)}</option>
                  <option value="ডাটা">{categoryLabel("ডাটা", locale)}</option>
                  <option value="ডিজাইন">{categoryLabel("ডিজাইন", locale)}</option>
                  <option value="সাইবার সিকিউরিটি">
                    {categoryLabel("সাইবার সিকিউরিটি", locale)}
                  </option>
                  <option value="ফ্রিল্যান্সিং">{categoryLabel("ফ্রিল্যান্সিং", locale)}</option>
                </datalist>
              </div>
              <div>
                <label className="label" htmlFor="level">
                  {pick(locale, "লেভেল", "Level")}
                </label>
                <input
                  id="level"
                  name="level"
                  className="input"
                  defaultValue={course?.level ?? "বিগিনার"}
                  list="level-options"
                />
                <datalist id="level-options">
                  <option value="বিগিনার">{levelLabel("বিগিনার", locale)}</option>
                  <option value="ইন্টারমিডিয়েট">{levelLabel("ইন্টারমিডিয়েট", locale)}</option>
                  <option value="অ্যাডভান্সড">{levelLabel("অ্যাডভান্সড", locale)}</option>
                </datalist>
              </div>
              <div>
                <label className="label" htmlFor="hours">
                  {pick(locale, "মোট ঘণ্টা", "Total hours")}
                </label>
                <input
                  id="hours"
                  name="hours"
                  type="number"
                  min={1}
                  className="input"
                  defaultValue={course?.hours ?? 20}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold">
              {pick(locale, "শেখার ফলাফল", "Learning outcomes")}
            </h2>
            <span className="pill">
              {pick(
                locale,
                `${formatNumber(outcomeCount, locale)}টি`,
                `${formatNumber(outcomeCount, locale)} outcomes`
              )}
            </span>
          </div>
          <label className="label mt-3" htmlFor="outcomes">
            {pick(locale, "প্রতি লাইনে একটি ফলাফল", "One outcome per line")}
          </label>
          <textarea
            id="outcomes"
            name="outcomes"
            className="input min-h-32"
            required
            defaultValue={course?.outcomes.join("\n") ?? ""}
            placeholder={pick(
              locale,
              "নিজের পোর্টফোলিও সাইট বানাতে পারবেন\nReact কম্পোনেন্ট লিখতে পারবেন",
              "Build your own portfolio site\nWrite React components"
            )}
          />
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold">
                {pick(locale, "কারিকুলাম", "Curriculum")}
              </h2>
              <p className="text-[0.68rem] text-muted">
                {pick(
                  locale,
                  `${formatNumber(modules.length, locale)}টি মডিউল · ${formatNumber(totalLessons, locale)}টি লেসন`,
                  `${formatNumber(modules.length, locale)} modules · ${formatNumber(totalLessons, locale)} lessons`
                )}
              </p>
            </div>
            <button type="button" onClick={addModule} className="btn btn-outline btn-sm">
              {pick(locale, "+ মডিউল যোগ করুন", "+ Add module")}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {modules.map((m, mi) => (
              <div key={mi} className="rounded-xl border border-line-soft bg-page/60 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy font-mono text-[0.7rem] font-bold text-cream">
                    {String(mi + 1).padStart(2, "0")}
                  </span>
                  <input
                    className="input py-1.5 text-sm font-semibold"
                    value={m.title}
                    onChange={(e) => updateModule(mi, { title: e.target.value })}
                    placeholder={pick(locale, "মডিউলের নাম", "Module title")}
                    aria-label={pick(
                      locale,
                      `মডিউল ${mi + 1} এর নাম`,
                      `Module ${mi + 1} title`
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(mi)}
                    className="shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
                    disabled={modules.length === 1}
                  >
                    {pick(locale, "মুছুন", "Delete")}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {m.lessons.map((l, li) => (
                    <div key={li} className="rounded-lg border border-line-soft bg-surface p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.65rem] text-muted">{mi + 1}.{li + 1}</span>
                        <input
                          className="input py-1.5 text-sm"
                          value={l.title}
                          onChange={(e) => updateLesson(mi, li, { title: e.target.value })}
                          placeholder={pick(locale, "লেসনের নাম", "Lesson title")}
                          aria-label={pick(
                            locale,
                            `লেসন ${mi + 1}.${li + 1}`,
                            `Lesson ${mi + 1}.${li + 1}`
                          )}
                        />
                        <input
                          className="input w-20 py-1.5 text-center text-sm"
                          type="number"
                          min={1}
                          value={l.minutes}
                          onChange={(e) =>
                            updateLesson(mi, li, { minutes: Number(e.target.value) || 1 })
                          }
                          aria-label={pick(locale, "সময় (মিনিট)", "Duration (minutes)")}
                        />
                        <span className="hidden text-[0.65rem] text-muted sm:inline">
                          {pick(locale, "মিনিট", "minutes")}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLesson(mi, li)}
                          className="shrink-0 rounded-md px-1.5 py-1 text-[0.65rem] font-semibold text-live hover:bg-live/10"
                          disabled={m.lessons.length === 1}
                          aria-label={pick(locale, "লেসন মুছুন", "Delete lesson")}
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        className="input mt-2 py-1.5 text-xs"
                        value={l.summary ?? ""}
                        onChange={(e) => updateLesson(mi, li, { summary: e.target.value })}
                        placeholder={pick(
                          locale,
                          "লেসনের সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)",
                          "Short lesson summary (optional)"
                        )}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addLesson(mi)}
                  className="mt-2 text-[0.7rem] font-semibold text-orange-deep hover:underline"
                >
                  {pick(locale, "+ এই মডিউলে লেসন যোগ করুন", "+ Add a lesson to this module")}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">
            {pick(locale, "ইনস্ট্রাক্টর", "Instructor")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="instructor_name">
                {pick(locale, "নাম", "Name")}
              </label>
              <input
                id="instructor_name"
                name="instructor_name"
                className="input"
                required
                defaultValue={course?.instructor_name ?? ""}
              />
            </div>
            <div>
              <label className="label" htmlFor="instructor_title">
                {pick(locale, "পদবি / পরিচিতি", "Title / role")}
              </label>
              <input
                id="instructor_title"
                name="instructor_title"
                className="input"
                defaultValue={course?.instructor_title ?? ""}
                placeholder={pick(
                  locale,
                  "সিনিয়র ফ্রন্টএন্ড ইঞ্জিনিয়ার",
                  "Senior Frontend Engineer"
                )}
              />
            </div>
          </div>
          <label className="label mt-4" htmlFor="instructor_bio">
            {pick(locale, "সংক্ষিপ্ত বায়ো", "Short bio")}
          </label>
          <textarea
            id="instructor_bio"
            name="instructor_bio"
            className="input min-h-24"
            defaultValue={course?.instructor_bio ?? ""}
          />
        </section>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">
            {pick(locale, "মূল্য", "Pricing")}
          </h2>
          <div className="mt-3 grid gap-3">
            <div>
              <label className="label" htmlFor="price">
                {pick(locale, "বিক্রয় মূল্য (৳)", "Sale price (৳)")}
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                className="input"
                defaultValue={course?.price ?? 0}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="original_price">
                {pick(locale, "আসল মূল্য (৳)", "Original price (৳)")}
              </label>
              <input
                id="original_price"
                name="original_price"
                type="number"
                min={0}
                className="input"
                defaultValue={course?.original_price ?? 0}
              />
            </div>
            <p className="text-[0.65rem] text-muted">
              {pick(
                locale,
                "0 দিলে কোর্সটি ফ্রি হিসেবে দেখাবে। আসল মূল্য বেশি হলে ছাড়ের ব্যাজ দেখাবে।",
                "Set to 0 to show the course as free. If the original price is higher, a discount badge is shown."
              )}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">
            {pick(locale, "কভার ও আইকন", "Cover & icon")}
          </h2>
          <div className="mt-3">
            <label className="label" htmlFor="icon">
              {pick(locale, "আইকন টেক্সট", "Icon text")}
            </label>
            <input
              id="icon"
              name="icon"
              className="input font-mono"
              defaultValue={course?.icon ?? "{}"}
              maxLength={12}
            />
          </div>
          <p className="label mt-4">{pick(locale, "কভার গ্রেডিয়েন্ট", "Cover gradient")}</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setGradient(p.value)}
                className={`relative h-12 overflow-hidden rounded-lg border-2 text-[0.6rem] font-bold text-cream ${
                  gradient === p.value ? "border-orange" : "border-transparent"
                }`}
                style={{ background: p.value }}
                title={p.label(locale)}
              >
                <span className="absolute inset-0 grid place-items-center bg-navy/25">
                  {p.label(locale)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">
            {pick(locale, "প্রকাশ", "Publishing")}
          </h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={course ? course.published === 1 : true}
                className="h-4 w-4 accent-[#ED002B]"
              />
              {pick(locale, "পাবলিক সাইটে প্রকাশ করুন", "Publish on the public site")}
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={course ? course.featured === 1 : false}
                className="h-4 w-4 accent-[#ED002B]"
              />
              {pick(locale, "হোমপেজে ফিচার করুন", "Feature on the homepage")}
            </label>
          </div>
          <div className="mt-5 border-t border-line-soft pt-4">
            <SubmitButton isEdit={isEdit} locale={locale} />
            <Link href="/admin/courses" className="btn btn-ghost btn-sm mt-2 w-full">
              {pick(locale, "বাতিল", "Cancel")}
            </Link>
            {isEdit && (
              <Link
                href={`/courses/${slug}`}
                className="mt-1 block text-center text-[0.68rem] text-muted hover:text-ink"
              >
                {pick(locale, "পাবলিক পেজ দেখুন →", "View public page →")}
              </Link>
            )}
          </div>
        </section>
      </aside>
    </form>
  );
}
