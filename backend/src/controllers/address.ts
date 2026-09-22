import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getAddresses = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      const headerUserId = req.headers['x-user-id'];
      if (!headerUserId) return res.status(401).json({ message: 'Unauthorized' });
      
      const addresses = await prisma.address.findMany({ where: { userId: String(headerUserId) } });
      return res.json(addresses);
    }
    
    const addresses = await prisma.address.findMany({ where: { userId } });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const headerUserId = req.headers['x-user-id'] || (req as any).user?.id;
    if (!headerUserId) return res.status(401).json({ message: 'Unauthorized' });

    const { line1, line2, city, state, postalCode, country, isDefault } = req.body;

    const address = await prisma.address.create({
      data: {
        line1, line2, city, state, postalCode, country, isDefault,
        userId: String(headerUserId)
      }
    });
    res.status(201).json(address);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const address = await prisma.address.update({
      where: { id: String(id) },
      data: req.body
    });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.address.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

