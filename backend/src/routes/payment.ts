import { Router } from 'express';
import { createPayment, paymentWebhook, refundPayment } from '../controllers/payment.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', authenticateJWT, createPayment);
router.post('/webhook', paymentWebhook); 
router.post('/refund', authenticateJWT, requireAdmin, refundPayment);

export default router;
