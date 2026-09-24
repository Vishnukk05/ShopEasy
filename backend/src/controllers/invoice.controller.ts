import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInvoices = async (req: Request, res: Response): Promise<any> => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: {
            user: true
          }
        }
      }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
            items: true
          }
        }
      }
    });
    
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error });
  }
};

export const generateInvoicePdf = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as any as any;
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Mock PDF generation
    // In a real application, we would use a library like PDFKit to generate the PDF
    // and upload it to an S3 bucket or similar, then update the invoice with the URL.
    const mockFileUrl = `https://mock-storage.com/invoices/${invoice.invoiceNumber}.pdf`;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        fileUrl: mockFileUrl
      }
    });

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Error generating invoice PDF', error });
  }
};
