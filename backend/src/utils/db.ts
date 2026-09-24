import { PrismaClient } from '@prisma/client';

const primaryUrl = process.env.DATABASE_URL;
const backupUrl = process.env.BACKUP_DATABASE_URL;

const primaryDb = new PrismaClient({
  datasources: { db: { url: primaryUrl } },
});

const backupDb = backupUrl ? new PrismaClient({
  datasources: { db: { url: backupUrl } },
}) : null;

let isPrimaryDown = false;

// Custom robust wrapper for Automatic Failover & Dual-Write Replication
const createResilientClient = () => {
  return new Proxy(primaryDb, {
    get(target: any, prop: string) {
      
      // Handle top-level functions like $transaction, $queryRaw
      if (typeof target[prop] === 'function') {
        return async (...args: any[]) => {
          if (isPrimaryDown && backupDb) {
            return (backupDb as any)[prop](...args);
          }
          try {
            return await target[prop].apply(target, args);
          } catch (error: any) {
            if (error.code === 'P1001' || error.code === 'P1008' || (error.message && error.message.includes('Can\'t reach database'))) {
              console.error(`[DB FAILOVER TRIGGERED] Primary database down during ${prop}. Switching to Backup.`);
              isPrimaryDown = true;
              if (backupDb) {
                return (backupDb as any)[prop](...args);
              }
            }
            throw error;
          }
        };
      }

      // Handle model delegates like user, product, order
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return new Proxy(target[prop], {
          get(modelTarget: any, operation: string) {
            if (typeof modelTarget[operation] === 'function') {
              return async (...args: any[]) => {
                
                // 1. FAILOVER: Route immediately to backup if primary is marked dead
                if (isPrimaryDown && backupDb) {
                  return (backupDb as any)[prop][operation](...args);
                }

                try {
                  // 2. Execute on Primary
                  const result = await modelTarget[operation](...args);

                  // 3. REPLICATION: Dual-write mutative operations asynchronously to Backup
                  if (backupDb && ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'].includes(operation)) {
                    (backupDb as any)[prop][operation](...args).catch((err: any) => {
                      console.error(`[Replication Warning] Failed to mirror ${operation} on ${prop} to backup:`, err.message);
                    });
                  }

                  return result;
                } catch (error: any) {
                  // Catch connection errors or timeouts
                  if (error.code === 'P1001' || error.code === 'P1008' || (error.message && error.message.includes('Can\'t reach database'))) {
                    console.error(`[DB FAILOVER TRIGGERED] Primary database connection failed. Switching to Backup for ${prop}.${operation}`);
                    isPrimaryDown = true;
                    if (backupDb) {
                      return (backupDb as any)[prop][operation](...args);
                    }
                  }
                  // Rethrow if it's a validation error or backup is unavailable
                  throw error;
                }
              };
            }
            return modelTarget[operation];
          }
        });
      }
      return target[prop];
    }
  });
};

const prisma = createResilientClient();

export default prisma as PrismaClient;
