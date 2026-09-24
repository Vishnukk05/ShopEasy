import express from 'express';
import { getProductVariants, createVariant, updateVariant } from '../controllers/variant.controller';
import { authenticateJWT, requirePermission } from '../middlewares/authMiddleware';

const router = express.Router();

// Public route to view variants
router.get('/:productId/variants', getProductVariants);

// Protected routes to manage variants
router.post('/:productId/variants', authenticateJWT, requirePermission('product.write'), createVariant);
router.put('/variants/:variantId', authenticateJWT, requirePermission('product.write'), updateVariant);

export default router;
