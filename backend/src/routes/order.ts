import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/order';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createOrder);
router.get('/', authenticateJWT, getUserOrders);

export default router;

