import { Request, Response } from 'express';
import prisma from '../utils/db';

// POST /api/payment/create
export const createPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId, amount, currency = 'USD', provider = 'STRIPE' } = req.body;
    
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Mock payment provider ID
    const providerId = `txn_${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        orderId,
        provider,
        providerId,
        amount,
        currency,
        status: 'PENDING',
      }
    });

    return res.status(201).json({ paymentId: payment.id, providerId, status: payment.status });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ message: 'Failed to create payment' });
  }
};

// POST /api/payment/webhook
export const paymentWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const signature = req.headers['x-provider-signature'];
    if (!signature) {
      return res.status(401).json({ message: 'Missing webhook signature' });
    }

    const { providerId, status, eventType, payload, eventId } = req.body; 

    const payment = await prisma.payment.findFirst({ where: { providerId } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Idempotency check
    const existingEvent = await prisma.paymentEvent.findFirst({
      where: { paymentId: payment.id, eventType, payload: { equals: payload } }
    });
    if (existingEvent) {
      return res.status(200).json({ message: 'Webhook already processed' });
    }

    await prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType,
        payload: payload || {},
      }
    });

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status }
    });

    if (status === 'SUCCESS') {
      const order = await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' }
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'PAID',
          notes: 'Payment successful',
        }
      });

      // Auto-generate invoice
      const invoiceNumber = `INV-${Date.now()}`;
      await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          fileUrl: `https://s3.example.com/invoices/${invoiceNumber}.pdf`, // mocked pdf URL
          totalAmount: payment.amount
        }
      });

      // Enqueue Notification
      await prisma.notificationLog.create({
        data: {
          recipient: 'test@example.com',
          templateId: 'test_template',
          status: 'PENDING',
          
        }
      });

    } else if (status === 'FAILED') {
      const order = await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CANCELLED' } 
      });
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'CANCELLED',
          notes: 'Payment failed',
        }
      });
    }

    return res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// POST /api/payment/refund
export const refundPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { paymentId, amount, reason } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount,
        reason,
        status: 'SUCCESS',
        providerRefundId: `ref_${Date.now()}`
      }
    });

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' }
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CANCELLED' }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: payment.orderId,
        status: 'CANCELLED',
        notes: 'Order refunded',
      }
    });

    return res.json({ success: true, refund });
  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({ message: 'Refund failed' });
  }
};
