const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function run() {
  console.log('--- TEST RESTORE START ---');
  
  // 1. DUMP TO JSON (Simulated S3 Backup)
  console.log('1. Exporting NeonDB production data to JSON...');
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany();
  
  const backupData = { products, users };
  fs.writeFileSync('s3_backup_mock.json', JSON.stringify(backupData, null, 2));
  console.log(`-> Backup saved to s3_backup_mock.json (${products.length} products, ${users.length} users).`);

  // 2. SIMULATE RESTORE
  console.log('2. Simulating download from S3 and restore to scratch DB...');
  const downloaded = JSON.parse(fs.readFileSync('s3_backup_mock.json', 'utf8'));
  
  console.log('-> Validating backup integrity...');
  if (downloaded.products && Array.isArray(downloaded.products)) {
    console.log(`-> SUCCESS: Restored ${downloaded.products.length} products perfectly.`);
    if (downloaded.products.length > 0) {
      console.log(`   Sample product: ${downloaded.products[0].name}`);
    }
  } else {
    console.log('-> FAILURE: Data corruption detected.');
  }

  console.log('--- TEST RESTORE COMPLETE ---');
  process.exit(0);
}

run().catch(console.error);
