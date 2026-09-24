import { Request, Response } from 'express';
import prisma from '../utils/db';

export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, totalAmount, shippingAddressId, paymentId } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddressId,
                items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.price,
            subtotal: i.price * i.quantity
          }))
        }
      }
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order', error: String(error) });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

