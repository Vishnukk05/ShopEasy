import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
};

export const getBanners = async (req: Request, res: Response) => {
  const banners = await prisma.banner.findMany();
  res.json(banners);
};

export const createBanner = async (req: Request, res: Response) => {
  const banner = await prisma.banner.create({ data: req.body });
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

export const sendCampaign = async (req: Request, res: Response) => {
  // In reality, this would send an email. We just log it to DB.
  const campaign = await prisma.campaign.create({ data: req.body });
  res.json(campaign);
};

