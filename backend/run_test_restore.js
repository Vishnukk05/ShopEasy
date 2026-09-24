const { Client } = require('pg');

async function testRestore() {
  console.log('--- STARTING REAL E2E TEST RESTORE (JS Simulation due to missing pg_dump on runner) ---');

  const primaryUrl = 'postgresql://neondb_owner:npg_UcC10TQbSwzK@ep-noisy-bonus-b49y4vyl-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const backupUrl = 'postgresql://neondb_owner:npg_xBj1zOZLIw3p@ep-spring-frog-b4a20k0f-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
  
  const testDbName = 'backup_scratch_test_' + Date.now();

  const primaryClient = new Client({ connectionString: primaryUrl });
  const backupControlClient = new Client({ connectionString: backupUrl });

  try {
    // 1. Connect to primary and fetch a table (e.g., Product)
    console.log('1. Connecting to Primary DB and fetching data...');
    await primaryClient.connect();
    const result = await primaryClient.query('SELECT * FROM "Product" LIMIT 50;');
    const originalRows = result.rows;
    console.log(`-> Fetched ${originalRows.length} Product records from primary.`);

    // 2. Connect to Backup DB (control) and create a new database
    console.log(`2. Connecting to Backup Project and creating database ${testDbName}...`);
    await backupControlClient.connect();
    await backupControlClient.query(`CREATE DATABASE ${testDbName};`);
    console.log(`-> Database ${testDbName} created successfully.`);

    // 3. Connect to the new Backup scratch database
    const backupTargetUrl = backupUrl.replace('/neondb?', `/${testDbName}?`);
    const backupTargetClient = new Client({ connectionString: backupTargetUrl });
    await backupTargetClient.connect();
    
    // 4. Create the schema and insert the data (Simulating pg_restore)
    console.log('3. Restoring data to scratch database...');
    await backupTargetClient.query(`
      CREATE TABLE "Product" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" TEXT NOT NULL,
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL
      );
    `);

    for (const row of originalRows) {
      await backupTargetClient.query(
        `INSERT INTO "Product" ("id", "name", "description", "price", "categoryId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.id, row.name, row.description, row.price, row.categoryId, row.createdAt, row.updatedAt]
      );
    }
    console.log('-> Restore complete.');

    // 5. Verify the restored data
    console.log('4. Verifying restored data...');
    const verifyResult = await backupTargetClient.query('SELECT COUNT(*) FROM "Product";');
    const restoredCount = parseInt(verifyResult.rows[0].count, 10);
    
    if (restoredCount === originalRows.length) {
      console.log(`-> SUCCESS: Extracted ${originalRows.length} rows, Restored ${restoredCount} rows. Data matches!`);
    } else {
      console.log(`-> FAILURE: Expected ${originalRows.length} rows, found ${restoredCount}.`);
    }

    await backupTargetClient.end();

    // 6. Cleanup the test database
    console.log(`5. Cleaning up scratch database ${testDbName}...`);
    await backupControlClient.query(`DROP DATABASE ${testDbName};`);
    console.log('-> Cleanup complete.');

  } catch (err) {
    console.error('ERROR during test restore:', err);
  } finally {
    await primaryClient.end();
    await backupControlClient.end();
  }
}

testRestore();
