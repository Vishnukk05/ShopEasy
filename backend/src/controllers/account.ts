import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/db';

export const getActiveSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sessions = await prisma.customerSession.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        lastActiveAt: true,
        createdAt: true,
        expiresAt: true
      },
      orderBy: {
        lastActiveAt: 'desc'
      }
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};

export const logoutAllDevices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Alternatively, we could keep the current session, but "logout all devices" usually means clear all
    // or clear all except current. I'll clear all.
    await prisma.customerSession.deleteMany({
      where: {
        userId
      }
    });

    res.json({ message: 'Logged out of all devices successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out of devices', error });
  }
};
