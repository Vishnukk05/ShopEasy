import { Router } from 'express';
import { getInvoices, getInvoiceById, generateInvoicePdf } from '../controllers/invoice.controller';

const router = Router();

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/:id/generate-pdf', generateInvoicePdf);

export default router;
