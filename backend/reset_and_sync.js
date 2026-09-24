const { Client } = require('pg');
const { execSync } = require('child_process');

const mainUrl = process.env.DATABASE_URL;
const backupUrl = process.env.BACKUP_DATABASE_URL;

async function resetAndSync() {
  console.log('1. Clearing all tables in Main DB...');
  const mainClient = new Client({ connectionString: mainUrl });
  await mainClient.connect();
  await mainClient.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await mainClient.end();
  console.log('✅ Main DB cleared.');

  console.log('2. Clearing all tables in Backup DB...');
  const backupClient = new Client({ connectionString: backupUrl });
  await backupClient.connect();
  await backupClient.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await backupClient.end();
  console.log('✅ Backup DB cleared.');

  console.log('3. Pushing schema to Main DB...');
  execSync('npx prisma db push', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: mainUrl } });
  console.log('✅ Main DB schema created.');

  console.log('4. Pushing schema to Backup DB...');
  execSync('npx prisma db push', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: backupUrl } });
  console.log('✅ Backup DB schema created.');

  console.log('🎉 Both databases have been cleared, recreated, and perfectly synchronized with the latest schema!');
}

resetAndSync().catch(console.error);
