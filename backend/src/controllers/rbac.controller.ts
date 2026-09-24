import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.userRole.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionIds } = req.body;
    
    const role = await prisma.userRole.create({
      data: {
        name,
        description,
        permissions: {
          create: (permissionIds || []).map((pid: string) => ({
            permission: { connect: { id: pid } }
          }))
        }
      },
      include: {
        permissions: { include: { permission: true } }
      }
    });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create role' });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
};

export const seedPermissions = async (req: Request, res: Response) => {
  try {
    const defaultPermissions = [
      'product.read', 'product.write',
      'order.read', 'order.update',
      'inventory.read', 'inventory.write',
      'analytics.read', 'users.manage'
    ];

    for (const name of defaultPermissions) {
      await prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name, description: `Allows ${name.replace('.', ' ')}` }
      });
    }

    res.json({ message: 'Permissions seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed permissions' });
  }
};
