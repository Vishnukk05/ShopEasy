import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params as any as any;
    const reviews = await prisma.review.findMany({
      where: { 
        productId,
        isVisible: true
      },
      include: {
        user: {
          select: { id: true, name: true }
        },
        images: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId, rating, title, comment, imageUrls } = req.body;
    
    // In a real app, userId comes from auth middleware
    const userId = req.body.userId || (req as any).user?.id; 

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify if user purchased the product
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED' // or whatever implies a completed purchase
        }
      }
    });

    const isVerified = orderItems.length > 0;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        title,
        comment,
        isVerified,
        isVisible: true, // Default to true, or false if pre-moderation is required
        images: {
          create: (imageUrls || []).map((url: String) => ({ imageUrl: url }))
        }
      },
      include: {
        images: true
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

export const moderateReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const { isVisible } = req.body; // true to approve, false to hide/reject

    const review = await prisma.review.update({
      where: { id },
      data: { isVisible }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error moderating review', error });
  }
};

export const getAllReviews = async (req: Request, res: Response): Promise<any> => {
  // Useful for admin dashboard to see all reviews including hidden ones
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
        images: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reviews', error });
  }
};
