import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductVariants = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params as any as any;
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      include: { inventory: true }
    });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch variants' });
  }
};

export const createVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params as any as any;
    const { sku, name, price, stockQuantity, attributes, imageUrl } = req.body;

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        name,
        price,
        stockQuantity,
        attributes,
        imageUrl,
        inventory: {
          create: {
            quantity: stockQuantity,
            productId,
          }
        }
      },
      include: { inventory: true }
    });

    res.status(201).json(variant);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ message: 'SKU must be unique' });
    res.status(500).json({ message: 'Failed to create variant' });
  }
};

export const updateVariant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { variantId } = req.params as any as any;
    const { price, stockQuantity, isActive } = req.body;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { price, stockQuantity, isActive }
    });
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update variant' });
  }
};
