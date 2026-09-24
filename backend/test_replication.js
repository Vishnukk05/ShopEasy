const { Client } = require('pg');

async function testReplication() {
  const primaryUrl = 'postgresql://neondb_owner:npg_UcC10TQbSwzK@ep-noisy-bonus-b49y4vyl-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const backupUrl = 'postgresql://neondb_owner:npg_xBj1zOZLIw3p@ep-spring-frog-b4a20k0f-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

  const primary = new Client({ connectionString: primaryUrl });
  const backup = new Client({ connectionString: backupUrl });

  try {
    await primary.connect();
    console.log("Connected to Primary");
    await primary.query("DROP PUBLICATION IF EXISTS shopeasy_pub;");
    await primary.query("CREATE PUBLICATION shopeasy_pub FOR ALL TABLES;");
    console.log("Publication created on Primary");

    await backup.connect();
    console.log("Connected to Backup");
    await backup.query("DROP SUBSCRIPTION IF EXISTS shopeasy_sub;");
    // Notice: Password must be in connection string for subscription
    await backup.query(`CREATE SUBSCRIPTION shopeasy_sub CONNECTION '${primaryUrl}' PUBLICATION shopeasy_pub;`);
    console.log("Subscription created on Backup");

  } catch (err) {
    console.error("Replication Error:", err);
  } finally {
    await primary.end();
    await backup.end();
  }
}

testReplication();
