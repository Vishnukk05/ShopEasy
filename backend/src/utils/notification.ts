import prisma from './db';

export const queueNotification = async (templateName: string, recipient: string, variables?: Record<string, string>) => {
  const template = await prisma.notificationTemplate.findUnique({
    where: { name: templateName }
  });
  
  if (!template) {
    throw new Error(`NotificationTemplate with name ${templateName} not found`);
  }

  return await prisma.notificationLog.create({
    data: {
      templateId: template.id,
      recipient,
      status: 'PENDING'
    }
  });
};

export const fetchNotificationTemplates = async () => {
  return await prisma.notificationTemplate.findMany();
};
