import { Router } from 'express';
import { getShipments, getShipmentById, updateShipmentStatus } from '../controllers/shipping.controller';

const router = Router();

router.get('/', getShipments);
router.get('/:id', getShipmentById);
router.put('/:id', updateShipmentStatus);

export default router;
