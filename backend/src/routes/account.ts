import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getActiveSessions, logoutAllDevices } from '../controllers/account';

const router = Router();

router.use(authenticateJWT);

router.get('/sessions', getActiveSessions);
router.post('/logout-all', logoutAllDevices);

export default router;
