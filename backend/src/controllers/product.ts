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
  } catch (error: any) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

export const createProductsBulk = async (req: Request, res: Response) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid payload. Expected an array of products.' });
    }

    let successCount = 0;
    let errors = [];

    for (let [index, p] of products.entries()) {
      try {
        let categoryId = p.categoryId;
        if (!categoryId && p.categoryName) {
           let cat = await prisma.category.findFirst({
              where: { name: { equals: p.categoryName, mode: 'insensitive' } }
           });
           if (!cat) {
              cat = await prisma.category.create({
                 data: {
                    name: String(p.categoryName),
                    slug: String(p.categoryName).toLowerCase().replace(/[^a-z0-9]+/g, '-')
                 }
              });
           }
           categoryId = cat.id;
        }
        if (!categoryId) {
           errors.push('Row ' + (index + 1) + ': Category is missing');
           continue;
        }

        const slug = String(p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const imagesArr = p.images ? (Array.isArray(p.images) ? p.images : String(p.images).split(',').map((s:any)=>s.trim()).filter(Boolean)) : [];

        const existing = await prisma.product.findUnique({ where: { slug } });
        if (existing) {
           await prisma.product.update({
             where: { slug },
             data: {
               name: String(p.name),
               description: p.description ? String(p.description) : '',
               price: parseFloat(p.price) || 0,
               originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
               stockQuantity: parseInt(p.stockQuantity) || 0,
               categoryId,
               images: imagesArr,
               rating: p.rating ? parseFloat(p.rating) : 0,
             }
           });
        } else {
           await prisma.product.create({
             data: {
               name: String(p.name),
               slug,
               description: p.description ? String(p.description) : '',
               price: parseFloat(p.price) || 0,
               originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
               stockQuantity: parseInt(p.stockQuantity) || 0,
               categoryId,
               images: imagesArr,
               rating: p.rating ? parseFloat(p.rating) : 0,
             }
           });
        }
        successCount++;
      } catch (err: any) {
        errors.push('Row ' + (index + 1) + ': ' + err.message);
      }
    }
    return res.status(200).json({ message: 'Imported ' + successCount + ' products successfully.', errors });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error during bulk import', error: error.message });
  }
};

