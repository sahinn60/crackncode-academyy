"use client";

import { deleteCourseAction } from "@/lib/admin-actions";

export function DeleteCourseButton({ courseId, title }: { courseId: number; title: string }) {
  return (
    <form
      action={deleteCourseAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          `"${title}" কোর্সটি মুছে ফেলবেন? এর এনরোলমেন্ট ও প্রোগ্রেসও মুছে যাবে। এই কাজটি ফেরানো যাবে না।`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={courseId} />
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
      >
        মুছুন
      </button>
    </form>
  );
}
