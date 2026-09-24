import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with advanced mock data...');
  
  // Clean up existing data to prevent duplicates
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();

  // Create roles
  const adminRole = await prisma.userRole.create({
    data: { name: 'ADMIN', description: 'Super Administrator' }
  });
  
  const customerRole = await prisma.userRole.create({
    data: { name: 'CUSTOMER', description: 'Standard Customer' }
  });

  // Create an Admin user
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('P@ssw0rd', salt);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      roleId: adminRole.id,
    }
  });

  // Create Categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Clothing', slug: 'clothing' },
  });

  // Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Apple iPhone 15 Pro Max (256GB)',
      slug: 'apple-iphone-15-pro-max',
      description: 'Titanium design. A17 Pro chip. 48MP main camera. USB-C.',
      price: 1599.00,
      stockQuantity: 50,
      categoryId: electronics.id,
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"],
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5 ANC Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise cancellation. 30 hours battery life.',
      price: 299.99,
      stockQuantity: 100,
      categoryId: electronics.id,
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop"],
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-t-shirt',
      description: '100% organic cotton. Super soft and breathable.',
      price: 29.99,
      stockQuantity: 0, // Variants have their own stock
      categoryId: clothing.id,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"],
    },
  });

  // Add Variants to clothing
  await prisma.productVariant.createMany({
    data: [
      {
        productId: p3.id,
        sku: 'TSHIRT-BLK-S',
        name: 'Black - Small',
        price: 29.99,
        stockQuantity: 20,
        attributes: { size: 'S', color: 'Black' }
      },
      {
        productId: p3.id,
        sku: 'TSHIRT-BLK-M',
        name: 'Black - Medium',
        price: 29.99,
        stockQuantity: 15,
        attributes: { size: 'M', color: 'Black' }
      },
      {
        productId: p3.id,
        sku: 'TSHIRT-BLK-L',
        name: 'Black - Large',
        price: 34.99, // L costs more
        stockQuantity: 5,
        attributes: { size: 'L', color: 'Black' }
      }
    ]
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
