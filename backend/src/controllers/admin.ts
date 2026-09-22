import { Request, Response } from 'express';
import prisma from '../utils/db';
import { sendOrderStatusEmail, transporter } from '../utils/notifications';

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
};

export const createDeal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, discount, price, originalPrice, endTime } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/public/uploads/${req.file.filename}` : req.body.imageUrl as string;
    
    if (!imageUrl) return res.status(400).json({ message: 'Image is required' });

    const deal = await prisma.deal.create({
      data: {
        title: title as string,
        discount: discount as string,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        endTime: new Date(endTime as string),
        imageUrl
      }
    });
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating deal' });
  }
};

export const deleteDeal = async (req: Request, res: Response) => {
  await prisma.deal.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
};

export const getBanners = async (req: Request, res: Response) => {
  const banners = await prisma.banner.findMany();
  res.json(banners);
};

export const createBanner = async (req: Request, res: Response) => {
  const title = req.body.title as string;
  const imageUrl = req.file ? `http://localhost:5000/public/uploads/${req.file.filename}` : req.body.imageUrl as string;
  
  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const banner = await prisma.banner.create({ data: { title, imageUrl } });
  res.json(banner);
};

export const deleteBanner = async (req: Request, res: Response) => {
  await prisma.banner.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
};

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tickets);
};

export const createTicket = async (req: Request, res: Response) => {
  const ticket = await prisma.ticket.create({ data: req.body });
  res.json(ticket);
};

export const resolveTicket = async (req: Request, res: Response) => {
  const ticket = await prisma.ticket.update({ where: { id: req.params.id as string }, data: { status: 'RESOLVED' } });
  res.json(ticket);
};

export const getCampaigns = async (req: Request, res: Response) => {
  const campaigns = await prisma.campaign.findMany({ orderBy: { sentAt: 'desc' } });
  res.json(campaigns);
};

export const sendCampaign = async (req: Request, res: Response): Promise<any> => {
  try {
    const { subject, message } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `http://localhost:5000/public/uploads/${req.file.filename}`;
    }

    const campaign = await prisma.campaign.create({ data: { subject, message } });

    // Fetch all users with emails
    const users = await prisma.user.findMany({
      where: { email: { not: null } },
      select: { email: true }
    });

    const emails = users.map(u => u.email).filter(Boolean) as string[];

    if (emails.length > 0 && process.env.SMTP_EMAIL) {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #2874f0;">${subject}</h2>
          ${imageUrl ? `<img src="${imageUrl}" alt="Campaign Image" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />` : ''}
          <p style="white-space: pre-wrap;">${message}</p>
          <br/>
          <p style="font-size: 12px; color: #777;">You are receiving this because you are subscribed to ShopEasy newsletters.</p>
        </div>
      `;

      // Send via BCC to avoid exposing emails to everyone
      await transporter.sendMail({
        from: `"ShopEasy" <${process.env.SMTP_EMAIL}>`,
        bcc: emails.join(','),
        subject,
        html: htmlBody
      });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({ message: 'Server error sending campaign' });
  }
};

import bcrypt from 'bcryptjs';
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status },
      include: { user: true }
    });

    if (order.user?.email) {
      await sendOrderStatusEmail(order.user.email, order.id, status);
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};

