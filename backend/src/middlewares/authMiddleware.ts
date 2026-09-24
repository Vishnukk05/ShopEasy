import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    roleId?: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = { id: decodedUser.id, roleId: decodedUser.roleId || decodedUser.role };
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const requirePermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.roleId) {
        return res.status(403).json({ message: 'Forbidden: No role assigned' });
      }

      const userRole = await prisma.userRole.findUnique({
        where: { id: req.user.roleId },
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      });

      if (!userRole) {
        return res.status(403).json({ message: 'Forbidden: Role not found' });
      }

      const hasPermission = userRole.permissions.some(rp => rp.permission.name === requiredPermission);
      
      if (hasPermission || userRole.name === 'SUPER_ADMIN' || userRole.name === 'ADMIN') {
        next();
      } else {
        res.status(403).json({ message: `Forbidden: Requires permission '${requiredPermission}'` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error during permission check' });
    }
  };
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.roleId) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    const userRole = await prisma.userRole.findUnique({ where: { id: req.user.roleId } });
    if (userRole && (userRole.name === 'ADMIN' || userRole.name === 'SUPER_ADMIN' || userRole.name === 'STAFF')) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
