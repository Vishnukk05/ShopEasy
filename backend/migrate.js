const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  const localDb = new Client({
    connectionString: "postgresql://postgres:password123@localhost:5432/ecommerce?schema=public"
  });
  await localDb.connect();

  console.log('Migrating Users...');
  const users = await localDb.query('SELECT * FROM "User"');
  for (const row of users.rows) {
    try {
      await prisma.user.create({ data: row });
    } catch(e) { console.log('Skip user', row.email) }
  }

  console.log('Migrating Categories...');
  const cats = await localDb.query('SELECT * FROM "Category"');
  for (const row of cats.rows) {
    try {
      await prisma.category.create({ data: row });
    } catch(e) { console.log('Skip cat', row.slug) }
  }

  console.log('Migrating Products...');
  const prods = await localDb.query('SELECT * FROM "Product"');
  for (const row of prods.rows) {
    try {
      row.price = Number(row.price);
      if (row.originalPrice) row.originalPrice = Number(row.originalPrice);
      await prisma.product.create({ data: row });
    } catch(e) { console.log('Skip prod', row.slug, e.message) }
  }

  console.log('Done!');
  await localDb.end();
}
migrate();
