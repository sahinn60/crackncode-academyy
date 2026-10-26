import "server-only";
import { db } from "./db";
import type { Order } from "./types";

export async function fulfillOrder(order: Order) {
  if (order.status === "paid") return;

  const now = new Date().toISOString();
  await db
    .prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ?")
    .run(now, order.id);

  let courseIds: number[] = [];
  if (order.product_type === "course") {
    courseIds = [order.product_id];
  } else if (order.product_type === "bundle") {
    const row = await db
      .prepare("SELECT course_ids FROM bundles WHERE id = ?")
      .get<{ course_ids: string }>(order.product_id);
    if (row) {
      try {
        courseIds = JSON.parse(row.course_ids);
      } catch {
        courseIds = [];
      }
    }
  }

  for (const courseId of courseIds) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO enrollments (user_id, course_id, order_id, enrolled_at) VALUES (?, ?, ?, ?)"
      )
      .run(order.user_id, courseId, order.id, now);
  }

  if (order.product_type === "workshop") {
    await db
      .prepare("UPDATE workshops SET seats_left = MAX(seats_left - 1, 0) WHERE id = ?")
      .run(order.product_id);
  }
}

export async function cancelOrder(order: Order) {
  if (order.status !== "pending") return;
  await db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(order.id);
}
