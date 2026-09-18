import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null }, // Only get top-level by default
      include: { children: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, slug, parentId, imageUrl } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, parentId, imageUrl },
    });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Create Category Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    const { name, slug, parentId, imageUrl } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parentId, imageUrl },
    });
    res.json(category);
  } catch (error: any) {
    console.error('Update Category Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

