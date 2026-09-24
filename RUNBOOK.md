# ShopEasy V2 - Database Recovery Runbook

## Overview
This runbook details the procedure for recovering the primary ShopEasy V2 database from the automated Neon-to-Neon backups.

Backups are executed daily via GitHub Actions (`.github/workflows/backup.yml`). Instead of S3, the backups are restored as live, timestamped databases in a separate, isolated Neon project.

## Prerequisites
To perform a recovery, you need:
1. Access to the **Primary** Neon project dashboard.
2. Access to the **Backup** Neon project dashboard OR the `BACKUP_DATABASE_URL` credentials.
3. Access to Vercel/Render (or wherever the backend is hosted) to update environment variables.

## Procedure: How to Restore

### Step 1: Identify the Latest Backup
1. Connect to the Backup Neon project using `psql` or a GUI client (like DBeaver, TablePlus, or Neon's SQL Editor).
2. List the available backup databases. They follow the naming convention: `backup_YYYY_MM_DD_HH_MM_SS`.
   ```sql
   SELECT datname FROM pg_database WHERE datname LIKE 'backup_%' ORDER BY datname DESC;
   ```
3. Identify the most recent healthy backup database (e.g., `backup_2026_09_24_02_00_00`).

### Step 2: Switch to the Backup (Fastest Recovery)
Because the backup project is already a live Neon PostgreSQL instance, the fastest way to recover from a primary DB outage is to point the application directly to the backup database.
1. Formulate the new connection string. Take your `BACKUP_DATABASE_URL` and replace the default `/neondb?` path with the backup database name:
   `postgresql://neondb_owner:npg_xBj1zOZLIw3p@ep-spring-frog-b4a20k0f-pooler.c-6.us-east-2.aws.neon.tech/backup_2026_09_24_02_00_00?sslmode=require`
2. Go to your hosting provider (Vercel/Render).
3. Update the `DATABASE_URL` environment variable to this new connection string.
4. Redeploy or restart the backend service. The application is now live on the backup data.

### Step 3: Restore Data to the Primary Project (Long-term)
Once the crisis is averted, you will want to move data back to the primary project.
1. From your local machine, use `pg_dump` to extract the data from the active backup database:
   ```bash
   pg_dump "postgresql://neondb_owner:npg_xBj1zOZLIw3p@ep-spring-frog-b4a20k0f-pooler.c-6.us-east-2.aws.neon.tech/backup_2026_09_24_02_00_00?sslmode=require" -Fc -f recovery.custom
   ```
2. Restore it into the Primary Neon project:
   ```bash
   pg_restore -d "$PRIMARY_DATABASE_URL" --clean --if-exists --no-owner --no-privileges recovery.custom
   ```
3. Revert the `DATABASE_URL` environment variable on your hosting provider back to the primary project.

## Backup Retention
Backups older than 30 days are automatically dropped at the end of every successful backup run to prevent unbounded storage growth in the backup Neon project.
