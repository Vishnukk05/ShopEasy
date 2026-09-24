const { PrismaClient } = require('@prisma/client');
const primary = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const backup = new PrismaClient({ datasources: { db: { url: process.env.BACKUP_DATABASE_URL } } });

async function sync() {
  console.log('Starting full data sync from Primary to Backup...');

  // Order matters for foreign keys
  const models = [
    'user',
    'category',
    'product',
    'productVariant',
    'inventory',
    'stockMovement',
    'cart',
    'cartItem',
    'order',
    'orderStatusHistory',
    'orderItem',
    'payment',
    'paymentEvent',
    'refund',
    'review',
    'reviewImage',
    'shipment',
    'trackingEvent',
    'auditLog',
    'notificationTemplate',
    'notificationLog',
    'customerSession'
  ];

  for (const model of models) {
    if (!primary[model]) {
      console.log(`Model ${model} not found in Prisma client, skipping.`);
      continue;
    }
    console.log(`Fetching ${model}...`);
    try {
      const data = await primary[model].findMany();
      if (data.length > 0) {
        // clear existing data in backup just in case (optional, but createMany with skipDuplicates is safer)
        await backup[model].createMany({ data, skipDuplicates: true });
        console.log(`✅ Synced ${data.length} records for ${model}.`);
      } else {
        console.log(`- No records found for ${model}.`);
      }
    } catch (e) {
      console.error(`❌ Error syncing ${model}:`, e.message);
    }
  }

  console.log('Sync complete!');
}

sync()
  .catch(console.error)
  .finally(async () => {
    await primary.$disconnect();
    await backup.$disconnect();
  });
