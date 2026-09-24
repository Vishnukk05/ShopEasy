# ShopEasy V2: Disaster Recovery Runbook

## 1. Scope
This runbook covers the exact steps required to restore the ShopEasy V2 PostgreSQL database from an S3 backup archive in the event of catastrophic data loss, corruption, or infrastructure failure.

## 2. Prerequisites
- `psql` and `pg_restore` installed on the recovery machine.
- AWS CLI configured with read access to the S3 backup bucket.
- A fresh, empty PostgreSQL database instance (or a cleared schema).

## 3. Recovery Steps

### Step 3.1: Locate the Backup
List the available backups in the S3 bucket to find the most recent uncorrupted timestamp.
```bash
aws s3 ls s3://$AWS_S3_BACKUP_BUCKET/backups/
```

### Step 3.2: Download the Backup
```bash
aws s3 cp s3://$AWS_S3_BACKUP_BUCKET/backups/shopeasy_backup_YYYY-MM-DD_HH-MM-SS.sql.gz ./
```

### Step 3.3: Decompress the Archive
```bash
gunzip shopeasy_backup_YYYY-MM-DD_HH-MM-SS.sql.gz
```

### Step 3.4: Restore the Database
Ensure no applications are actively writing to the database target before running the restore command.
```bash
psql $DATABASE_URL < shopeasy_backup_YYYY-MM-DD_HH-MM-SS.sql
```

## 4. Verification
1. Run `npx prisma db pull` to verify schema integrity.
2. Query the `AuditLog` and `Order` tables to verify the latest records match the timestamp of the backup.
3. Bring the backend API back online and verify `/api/health`.

## 5. Post-Incident Review
If this restore was performed due to an incident, document the root cause and update this runbook if any steps were missing or inaccurate.
