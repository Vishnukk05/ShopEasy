import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { categoryId: String(category) } : {}),
        ...(search ? {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      include: { category: true },
    });
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, originalPrice, rating, stockQuantity, categoryId, images } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        rating,
        stockQuantity,
        categoryId,
        images,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, originalPrice, rating, stockQuantity, categoryId, images } = req.body;
    const product = await prisma.product.update({
      where: { id: String(id) },
      data: {
        name,
        slug,
        description,
        price,
        originalPrice,
        rating,
        stockQuantity,
        categoryId,
        images,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    // Manual cascade delete to avoid foreign key constraint errors
    await prisma.cartItem.deleteMany({ where: { productId: String(id) } });
    await prisma.orderItem.deleteMany({ where: { productId: String(id) } });
    
    await prisma.product.delete({
      where: { id: String(id) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

