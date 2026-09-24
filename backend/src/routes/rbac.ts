import express from 'express';
import { getRoles, createRole, getPermissions, seedPermissions } from '../controllers/rbac.controller';
import { authenticateJWT, requirePermission, requireAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireAdmin); // Only admins can access RBAC management

router.get('/roles', getRoles);
router.post('/roles', requirePermission('users.manage'), createRole);
router.get('/permissions', getPermissions);
router.post('/permissions/seed', seedPermissions);

export default router;
