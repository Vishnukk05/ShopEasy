import { Request, Response } from 'express';
import prisma from '../utils/db';
import cache from '../utils/cache';

export const getDeals = async (req: Request, res: Response) => {
  try {
    const cachedDeals = await cache.get('deals_all');
    if (cachedDeals) {
      return res.json(cachedDeals);
    }
    
    const deals = await prisma.deal.findMany({
      orderBy: { endTime: 'asc' }
    });
    
    await cache.set('deals_all', deals);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching deals' });
  }
};
