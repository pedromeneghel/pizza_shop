import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { orders, ordersItems, restaurants } from '.';

export const products = pgTable("products", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id, {
    onDelete: 'cascade'
  }),
  createAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const orderItemsRelations = relations(ordersItems, ({ one }) => {
  return {
    order: one(orders, {
      fields: [ordersItems.orderId],
      references: [orders.id],
      relationName: 'order_items_order'
    }),
    product: one(products, {
      fields: [ordersItems.productId],
      references: [products.id],
      relationName: 'order_items_product'
    })
  }
});
