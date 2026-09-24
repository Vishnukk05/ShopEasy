import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();

    const revenueResult = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'SUCCESS',
      },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
