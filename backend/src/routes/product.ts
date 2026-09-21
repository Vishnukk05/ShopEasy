import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductsBulk } from '../controllers/product';
import { authenticateJWT, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/bulk', authenticateJWT, requireAdmin, createProductsBulk);
router.post('/', authenticateJWT, requireAdmin, createProduct);
router.put('/:id', authenticateJWT, requireAdmin, updateProduct);
router.delete('/:id', authenticateJWT, requireAdmin, deleteProduct);

export default router;

