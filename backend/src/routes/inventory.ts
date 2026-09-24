import express from 'express';
import { getInventoryList, adjustStock } from '../controllers/inventory.controller';
import { authenticateJWT, requirePermission } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticateJWT);
router.use(requirePermission('inventory.write'));

router.get('/', getInventoryList);
router.post('/:inventoryId/adjust', adjustStock);

export default router;
