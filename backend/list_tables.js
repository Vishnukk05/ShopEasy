require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.BACKUP_DATABASE_URL });
client.connect().then(() => {
  return client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';");
}).then(res => {
  console.log("TABLES IN BACKUP DB (neondb):");
  console.log(res.rows.map(r => r.tablename).join(', '));
  client.end();
});
