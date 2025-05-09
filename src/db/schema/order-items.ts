import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { orders, products } from '.';

export const ordersItems = pgTable("orders_items", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, {
    onDelete: 'cascade'
  }),
  productId: text("product_id").references(() => products.id, {
    onDelete: 'set null'
  }),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
