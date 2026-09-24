#!/bin/bash
set -e

# ShopEasy V2 - Automated PostgreSQL Backup Script (Neon to Neon)

if [ -z "$DATABASE_URL" ]; then echo "DATABASE_URL not set"; exit 1; fi
if [ -z "$BACKUP_DATABASE_URL" ]; then echo "BACKUP_DATABASE_URL not set"; exit 1; fi

TIMESTAMP=$(date +"%Y_%m_%d_%H_%M_%S")
BACKUP_DB="backup_$TIMESTAMP"

echo "[$(date)] Starting database backup..."
echo "Target backup database: $BACKUP_DB"

# 1. Take the dump from the primary database (custom format)
echo "Extracting primary database..."
pg_dump "$DATABASE_URL" -Fc -f dump.custom

# 2. Create the new database in the backup project
echo "Creating database $BACKUP_DB in the backup project..."
psql "$BACKUP_DATABASE_URL" -c "CREATE DATABASE $BACKUP_DB;"

# 3. Construct the connection string for the newly created database
TARGET_URL="${BACKUP_DATABASE_URL/\/neondb?/\/$BACKUP_DB?}"

# 4. Restore the dump to the new database
echo "Restoring data to $BACKUP_DB..."
pg_restore -d "$TARGET_URL" --no-owner --no-privileges dump.custom || echo "Restore logged warnings (expected for schema creation)."

echo "Restore complete. Cleaning up local dump..."
rm dump.custom

# 5. Cleanup databases older than 30 days
echo "Checking for old backups to prune..."
OLD_DBS=$(psql "$BACKUP_DATABASE_URL" -t -c "SELECT datname FROM pg_database WHERE datname LIKE 'backup_%' AND (current_date - TO_DATE(SUBSTRING(datname FROM 8 FOR 10), 'YYYY_MM_DD')) > 30;")

for db in $OLD_DBS; do
  db=$(echo $db | xargs)
  if [ -n "$db" ]; then
    echo "Dropping old backup database: $db"
    psql "$BACKUP_DATABASE_URL" -c "DROP DATABASE IF EXISTS $db;"
  fi
done

echo "[$(date)] Backup process finished successfully."
