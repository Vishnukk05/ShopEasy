import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createOrder);
router.get('/my-orders', authenticateJWT, getUserOrders);
router.get('/', authenticateJWT, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticateJWT, requireAdmin, updateOrderStatus);

export default router;
