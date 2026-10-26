"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveCourseAction } from "@/lib/admin-actions";
import { slugify } from "@/lib/utils";
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

const presets = [
  { name: "ওয়েব", value: "linear-gradient(135deg,#0b1530 0%,#1c2b57 45%,#2a6fbf 100%)" },
  { name: "পাইথন", value: "linear-gradient(135deg,#0b1530 0%,#16734a 60%,#3dbe84 100%)" },
  { name: "AI", value: "linear-gradient(135deg,#0b1530 0%,#e8641f 60%,#f2c14e 100%)" },
  { name: "রিঅ্যাক্ট", value: "linear-gradient(135deg,#0b1530 0%,#121f42 50%,#7fb0ea 100%)" },
  { name: "কনটেস্ট", value: "linear-gradient(135deg,#121f42 0%,#e8641f 70%,#f2c14e 100%)" },
  { name: "ফ্রিল্যান্স", value: "linear-gradient(135deg,#0b1530 0%,#16734a 55%,#7fb0ea 100%)" },
  { name: "সিকিউরিটি", value: "linear-gradient(135deg,#0b1530 0%,#121f42 45%,#e5484d 100%)" },
  { name: "ডাটা", value: "linear-gradient(135deg,#121f42 0%,#2a6fbf 55%,#3dbe84 100%)" },
  { name: "ফ্লাটার", value: "linear-gradient(135deg,#0b1530 0%,#2a6fbf 60%,#7fb0ea 100%)" },
  { name: "ডিজাইন", value: "linear-gradient(135deg,#0b1530 0%,#f39322 60%,#f2c14e 100%)" },
  { name: "ডেভঅপস", value: "linear-gradient(135deg,#0b1530 0%,#1c2b57 50%,#3dbe84 100%)" },
  { name: "ওয়ার্ডপ্রেস", value: "linear-gradient(135deg,#121f42 0%,#2a6fbf 55%,#f2c14e 100%)" },
];

const emptyModule = (): Module => ({
  title: "",
  lessons: [{ title: "", minutes: 10, summary: "" }],
});

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "সংরক্ষণ হচ্ছে..." : isEdit ? "পরিবর্তন সংরক্ষণ করুন" : "কোর্স তৈরি করুন"}
    </button>
  );
}

export function CourseForm({ course }: { course?: FormCourse }) {
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
          <h2 className="font-display text-base font-bold">মূল তথ্য</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="label" htmlFor="title">কোর্সের নাম</label>
              <input
                id="title"
                name="title"
                className="input"
                required
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="যেমন: Next.js দিয়ে ফুল-স্ট্যাক অ্যাপ"
              />
            </div>
            <div>
              <label className="label" htmlFor="slug">স্লাগ (URL)</label>
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
                পাবলিক লিংক: /courses/{slug || "..."} — ইংরেজি ছোট হাতের অক্ষর ব্যবহার করুন।
              </p>
            </div>
            <div>
              <label className="label" htmlFor="subtitle">সংক্ষিপ্ত বর্ণনা</label>
              <input
                id="subtitle"
                name="subtitle"
                className="input"
                required
                defaultValue={course?.subtitle ?? ""}
                placeholder="এক বাক্যে কোর্সটি কী শেখাবে"
              />
            </div>
            <div>
              <label className="label" htmlFor="description">বিস্তারিত বিবরণ</label>
              <textarea
                id="description"
                name="description"
                className="input min-h-36"
                required
                defaultValue={course?.description ?? ""}
                placeholder="কোর্সে কী কী থাকবে, কার জন্য উপযোগী ইত্যাদি লিখুন..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="category">ক্যাটাগরি</label>
                <input
                  id="category"
                  name="category"
                  className="input"
                  required
                  defaultValue={course?.category ?? ""}
                  list="category-options"
                  placeholder="ওয়েব ডেভেলপমেন্ট"
                />
                <datalist id="category-options">
                  <option value="ওয়েব ডেভেলপমেন্ট" />
                  <option value="প্রোগ্রামিং" />
                  <option value="AI" />
                  <option value="ডাটা" />
                  <option value="ডিজাইন" />
                  <option value="সাইবার সিকিউরিটি" />
                  <option value="ফ্রিল্যান্সিং" />
                </datalist>
              </div>
              <div>
                <label className="label" htmlFor="level">লেভেল</label>
                <input
                  id="level"
                  name="level"
                  className="input"
                  defaultValue={course?.level ?? "বিগিনার"}
                  list="level-options"
                />
                <datalist id="level-options">
                  <option value="বিগিনার" />
                  <option value="ইন্টারমিডিয়েট" />
                  <option value="অ্যাডভান্সড" />
                </datalist>
              </div>
              <div>
                <label className="label" htmlFor="hours">মোট ঘণ্টা</label>
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
            <h2 className="font-display text-base font-bold">শেখার ফলাফল</h2>
            <span className="pill">{course?.outcomes.length ?? 0}টি</span>
          </div>
          <label className="label mt-3" htmlFor="outcomes">প্রতি লাইনে একটি ফলাফল</label>
          <textarea
            id="outcomes"
            name="outcomes"
            className="input min-h-32"
            required
            defaultValue={course?.outcomes.join("\n") ?? ""}
            placeholder={"নিজের পোর্টফোলিও সাইট বানাতে পারবেন\nReact কম্পোনেন্ট লিখতে পারবেন"}
          />
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold">কারিকুলাম</h2>
              <p className="text-[0.68rem] text-muted">
                {modules.length}টি মডিউল · {totalLessons}টি লেসন
              </p>
            </div>
            <button type="button" onClick={addModule} className="btn btn-outline btn-sm">
              + মডিউল যোগ করুন
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
                    placeholder="মডিউলের নাম"
                    aria-label={`মডিউল ${mi + 1} এর নাম`}
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(mi)}
                    className="shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
                    disabled={modules.length === 1}
                  >
                    মুছুন
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
                          placeholder="লেসনের নাম"
                          aria-label={`লেসন ${mi + 1}.${li + 1}`}
                        />
                        <input
                          className="input w-20 py-1.5 text-center text-sm"
                          type="number"
                          min={1}
                          value={l.minutes}
                          onChange={(e) =>
                            updateLesson(mi, li, { minutes: Number(e.target.value) || 1 })
                          }
                          aria-label="সময় (মিনিট)"
                        />
                        <span className="hidden text-[0.65rem] text-muted sm:inline">মিনিট</span>
                        <button
                          type="button"
                          onClick={() => removeLesson(mi, li)}
                          className="shrink-0 rounded-md px-1.5 py-1 text-[0.65rem] font-semibold text-live hover:bg-live/10"
                          disabled={m.lessons.length === 1}
                          aria-label="লেসন মুছুন"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        className="input mt-2 py-1.5 text-xs"
                        value={l.summary ?? ""}
                        onChange={(e) => updateLesson(mi, li, { summary: e.target.value })}
                        placeholder="লেসনের সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addLesson(mi)}
                  className="mt-2 text-[0.7rem] font-semibold text-orange-deep hover:underline"
                >
                  + এই মডিউলে লেসন যোগ করুন
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">ইনস্ট্রাক্টর</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="instructor_name">নাম</label>
              <input
                id="instructor_name"
                name="instructor_name"
                className="input"
                required
                defaultValue={course?.instructor_name ?? ""}
              />
            </div>
            <div>
              <label className="label" htmlFor="instructor_title">পদবি / পরিচিতি</label>
              <input
                id="instructor_title"
                name="instructor_title"
                className="input"
                defaultValue={course?.instructor_title ?? ""}
                placeholder="সিনিয়র ফ্রন্টএন্ড ইঞ্জিনিয়ার"
              />
            </div>
          </div>
          <label className="label mt-4" htmlFor="instructor_bio">সংক্ষিপ্ত বায়ো</label>
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
          <h2 className="font-display text-base font-bold">মূল্য</h2>
          <div className="mt-3 grid gap-3">
            <div>
              <label className="label" htmlFor="price">বিক্রয় মূল্য (৳)</label>
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
              <label className="label" htmlFor="original_price">আসল মূল্য (৳)</label>
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
              0 দিলে কোর্সটি ফ্রি হিসেবে দেখাবে। আসল মূল্য বেশি হলে ছাড়ের ব্যাজ দেখাবে।
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">কভার ও আইকন</h2>
          <div className="mt-3">
            <label className="label" htmlFor="icon">আইকন টেক্সট</label>
            <input
              id="icon"
              name="icon"
              className="input font-mono"
              defaultValue={course?.icon ?? "{}"}
              maxLength={12}
            />
          </div>
          <p className="label mt-4">কভার গ্রেডিয়েন্ট</p>
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
                title={p.name}
              >
                <span className="absolute inset-0 grid place-items-center bg-navy/25">{p.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-5">
          <h2 className="font-display text-base font-bold">প্রকাশ</h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={course ? course.published === 1 : true}
                className="h-4 w-4 accent-[#f39322]"
              />
              পাবলিক সাইটে প্রকাশ করুন
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={course ? course.featured === 1 : false}
                className="h-4 w-4 accent-[#f39322]"
              />
              হোমপেজে ফিচার করুন
            </label>
          </div>
          <div className="mt-5 border-t border-line-soft pt-4">
            <SubmitButton isEdit={isEdit} />
            <Link href="/admin/courses" className="btn btn-ghost btn-sm mt-2 w-full">
              বাতিল
            </Link>
            {isEdit && (
              <Link
                href={`/courses/${slug}`}
                className="mt-1 block text-center text-[0.68rem] text-muted hover:text-ink"
              >
                পাবলিক পেজ দেখুন →
              </Link>
            )}
          </div>
        </section>
      </aside>
    </form>
  );
}
