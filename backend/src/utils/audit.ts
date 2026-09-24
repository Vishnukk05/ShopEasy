import prisma from './db';

export const logAction = async (
  actorId: string | null,
  action: string,
  target: string,
  metadata: any,
  ip: string
) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        target,
        beforeValues: metadata?.beforeValues || {},
        afterValues: metadata?.afterValues || {},
        ipAddress: ip,
        userAgent: metadata?.userAgent || 'unknown',
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // DO NOT throw error. Audit logging failure should not break the business transaction,
    // though in a zero-trust environment you might want to fail closed. 
    // We log to stderr to ensure it is caught by APM/Winston.
  }
};
