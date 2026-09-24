import { Router } from 'express';
import { getProductReviews, createReview, moderateReview, getAllReviews } from '../controllers/review.controller';

const router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.post('/', createReview); // Should be protected by auth middleware in real app

// Admin routes
router.get('/admin', getAllReviews); // Should be protected by admin middleware
router.put('/admin/:id/moderate', moderateReview);

export default router;
