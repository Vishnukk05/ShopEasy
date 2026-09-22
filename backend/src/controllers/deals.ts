import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getDeals = async (req: Request, res: Response): Promise<any> => {
  try {
    const deals = await prisma.deal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching deals' });
  }
};

