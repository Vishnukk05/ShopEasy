import { Request, Response } from 'express';
import prisma from '../utils/db';
import cache from '../utils/cache';

export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, totalAmount, shippingAddressId } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify and decrement inventory for each item
      for (const i of items) {
        if (i.variantId) {
          const variant = await tx.productVariant.findUnique({ where: { id: i.variantId } });
          if (!variant || variant.stockQuantity < i.quantity) {
            throw new Error(`Insufficient stock for variant ${i.variantId}`);
          }
          await tx.productVariant.update({
            where: { id: i.variantId },
            data: { stockQuantity: { decrement: i.quantity } }
          });
        } else {
          const prod = await tx.product.findUnique({ where: { id: i.productId } });
          if (!prod || prod.stockQuantity < i.quantity) {
            throw new Error(`Insufficient stock for product ${i.productId}`);
          }
          await tx.product.update({
            where: { id: i.productId },
            data: { stockQuantity: { decrement: i.quantity } }
          });
        }
      }

      // 2. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddressId,
          status: 'PENDING',
          items: {
            create: items.map((i: any) => ({
              productId: i.productId,
              variantId: i.variantId || null,
              quantity: i.quantity,
              unitPrice: i.price,
              subtotal: i.price * i.quantity
            }))
          }
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'PENDING',
          notes: 'Order placed'
        }
      });
      
      return newOrder;
    });

    await cache.flushAll();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order', error: String(error) });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { 
        items: { include: { product: true } },
        payment: true,
        statusHistory: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const { status, notes } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        notes: notes || `Status updated to ${status}`
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
