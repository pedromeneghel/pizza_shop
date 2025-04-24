import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ordersItems, restaurants, users } from '.';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled'
]);

export const orders = pgTable("orders", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  customerId: text("customer_id").notNull().references(() => users.id, {
    onDelete: 'set null'
  }),
  restaurantId: text("restaurant_id").notNull().references(() => users.id, {
    onDelete: 'cascade'
  }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalPriceInCents: integer("total_price_in_cents").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow()
});

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: 'order_customer'
    }),
    restaurant: one(restaurants, {
      fields: [orders.restaurantId],
      references: [restaurants.id],
      relationName: 'order_restaurant'
    }),
    orderItems: many(ordersItems)
  }
});
