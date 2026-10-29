"use client";

import { pick, type Locale } from "@/lib/i18n";
import { deleteCourseAction } from "@/lib/admin-actions";

export function DeleteCourseButton({
  courseId,
  title,
  locale,
}: {
  courseId: number;
  title: string;
  locale: Locale;
}) {
  return (
    <form
      action={deleteCourseAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          pick(
            locale,
            `"${title}" কোর্সটি মুছে ফেলবেন? এর এনরোলমেন্ট ও প্রোগ্রেসও মুছে যাবে। এই কাজটি ফেরানো যাবে না।`,
            `Delete the course "${title}"? Its enrollments and progress will be removed too. This action cannot be undone.`
          )
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={courseId} />
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
      >
        {pick(locale, "মুছুন", "Delete")}
      </button>
    </form>
  );
}
