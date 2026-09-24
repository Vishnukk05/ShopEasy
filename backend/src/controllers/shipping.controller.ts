import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShipments = async (req: Request, res: Response): Promise<any> => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        order: {
          include: {
            user: true
          }
        },
        events: true,
      }
    });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipments', error });
  }
};

export const getShipmentById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        order: true,
        events: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipment', error });
  }
};

export const updateShipmentStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const { status, trackingNumber, carrier, location, description } = req.body;

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      }
    });

    if (status || location || description) {
      await prisma.trackingEvent.create({
        data: {
          shipmentId: id,
          status: status || updatedShipment.status,
          location,
          description
        }
      });
    }

    res.json(updatedShipment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shipment status', error });
  }
};
