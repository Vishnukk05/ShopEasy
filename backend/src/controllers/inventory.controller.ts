import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInventoryList = async (req: Request, res: Response): Promise<any> => {
  try {
    const list = await prisma.inventory.findMany({
      include: { product: true, variant: true }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

export const adjustStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const { inventoryId } = req.params as any as any;
    const { quantityChange, reason } = req.body;

    const inventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity: { increment: quantityChange } }
    });

    await prisma.stockMovement.create({
      data: { inventoryId, quantity: quantityChange, reason }
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error adjusting stock' });
  }
};
