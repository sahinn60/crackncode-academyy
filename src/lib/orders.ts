import "server-only";
import { db } from "./db";
import type { Order } from "./types";

export function fulfillOrder(order: Order) {
  if (order.status === "paid") return;

  const now = new Date().toISOString();
  db.prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ?").run(now, order.id);

  let courseIds: number[] = [];
  if (order.product_type === "course") {
    courseIds = [order.product_id];
  } else if (order.product_type === "bundle") {
    const row = db
      .prepare("SELECT course_ids FROM bundles WHERE id = ?")
      .get(order.product_id) as { course_ids: string } | undefined;
    if (row) {
      try {
        courseIds = JSON.parse(row.course_ids);
      } catch {
        courseIds = [];
      }
    }
  }

  const enroll = db.prepare(
    "INSERT OR IGNORE INTO enrollments (user_id, course_id, order_id, enrolled_at) VALUES (?, ?, ?, ?)"
  );
  for (const courseId of courseIds) {
    enroll.run(order.user_id, courseId, order.id, now);
  }

  if (order.product_type === "workshop") {
    db.prepare(
      "UPDATE workshops SET seats_left = MAX(seats_left - 1, 0) WHERE id = ?"
    ).run(order.product_id);
  }
}

export function cancelOrder(order: Order) {
  if (order.status !== "pending") return;
  db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(order.id);
}
