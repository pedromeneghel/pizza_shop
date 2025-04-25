import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import chalk from 'chalk';
import { db } from './connection';
import { authLinks, orders, ordersItems, products, restaurants, users } from './schema';
/**
 * Reset database
 */
await db.delete(users);
await db.delete(restaurants);
await db.delete(ordersItems);
await db.delete(orders);
await db.delete(products);
await db.delete(authLinks);

console.log(chalk.yellow('✔️ Database reset'));

/**
 * Create users
 */
const [customer1, customer2] = await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer'
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer'
  }
]).returning();

console.log(chalk.yellow('✔️ Created customers!'));

/**
 * Create manager
 */
const [manager] = await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: 'admin@admin.com',
    role: 'manager'
  }
]).returning({ id: users.id });

console.log(chalk.yellow('✔️ Created manager!'));

/**
 * Create restaurant
 */
const [restaurant] = await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager?.id
  }
]).returning();

/**
 * Create products
 */

function generateRandomProducts() {
  return {
    name: faker.commerce.productName(),
    restaurantId: restaurant!.id,
    description: faker.commerce.productDescription(),
    priceInCents: Number(faker.commerce.price({ min: 100, max: 10000, dec: 0 }))
  };
}
const availableProducts = await db.insert(products).values([
  generateRandomProducts(),
  generateRandomProducts(),
  generateRandomProducts(),
  generateRandomProducts(),
  generateRandomProducts()
]).returning();

console.log(chalk.yellow('✔️ Created products!'));

/**
 * Create orders
 */
type OrderItemInsert = typeof ordersItems.$inferInsert;
type OrderInsert = typeof orders.$inferInsert;

const orderItemsToInsert: OrderItemInsert[] = [];
const ordersToInsert: OrderInsert[] = [];

for(let i = 0; i < 200; i++) {
  const orderId = createId();
  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3
  });

  let totalPriceInCents = 0;

  orderProducts.forEach(orderProduct => {
    const quantity = faker.number.int({ min: 1, max: 5 });
    totalPriceInCents += orderProduct.priceInCents * quantity;

    orderItemsToInsert.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity
    });
  });

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1!.id, customer2!.id]),
    restaurantId: restaurant!.id,
    status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled']),
    totalPriceInCents,
    createdAt: faker.date.recent({ days: 30 })
  });
}

await db.insert(orders).values(ordersToInsert);
await db.insert(ordersItems).values(orderItemsToInsert);

console.log(chalk.yellow('✔️ Created orders!'));

console.log(chalk.greenBright('Database seeded successfully!'))

process.exit();
