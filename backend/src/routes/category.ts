import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category';
import { authenticateJWT, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, requireAdmin, createCategory);
router.put('/:id', authenticateJWT, requireAdmin, updateCategory);
router.delete('/:id', authenticateJWT, requireAdmin, deleteCategory);

export default router;

