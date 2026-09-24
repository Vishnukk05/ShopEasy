import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../utils/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// POST /api/payment/create-order
export const createPaymentOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// POST /api/payment/verify
export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // { items, totalAmount, shippingAddressId }
    } = req.body;

    const userId = (req as any).user?.id;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create order in DB with verified payment ID
    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: orderData.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
        totalAmount: orderData.totalAmount,
        shippingAddressId: orderData.shippingAddressId,
        
        status: 'CONFIRMED' as any,
      },
    });

    return res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// POST /api/payment/cod-order  (Cash on Delivery - no Razorpay needed)
export const createCodOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    const { items, totalAmount, shippingAddressId } = req.body;

    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
        totalAmount,
        shippingAddressId,
        
        status: 'PENDING',
      },
    });

    return res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('COD order error:', error);
    return res.status(500).json({ message: 'Failed to place COD order' });
  }
};
