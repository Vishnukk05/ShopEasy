import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clean up existing data to prevent duplicates on rerun
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create an Admin user
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('P@ssw0rd', salt);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    }
  });

  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Clothing', slug: 'clothing' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Apple iPhone 15 Pro Max (256GB)',
        slug: 'apple-iphone-15-pro-max',
        description: 'Titanium design. A17 Pro chip. 48MP main camera. USB-C.',
        price: 1599.00,
        stockQuantity: 50,
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"],
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3.',
        price: 1299.00,
        stockQuantity: 40,
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop"],
      },
      {
        name: 'Sony WH-1000XM5 ANC Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancellation. 30 hours battery life.',
        price: 299.99,
        stockQuantity: 100,
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop"],
      },
      {
        name: 'Apple MacBook Air M3 (8GB/256GB)',
        slug: 'apple-macbook-air-m3',
        description: 'Supercharged by M3. 13.6-inch Liquid Retina display.',
        price: 1149.00,
        stockQuantity: 35,
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop"],
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

