import express from 'express';
import { register, login, loginWith2FA, oauthLogin, verifyOtp, updateProfile, requestVerification, verifyContact, forgotPassword, resetPassword, generate2FA, verify2FA } from '../controllers/auth';
import { authenticateJWT, requireAdmin } from '../middlewares/authMiddleware';
import { authRateLimiter } from '../middlewares/security';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/login/2fa', authRateLimiter, loginWith2FA);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.post('/oauth', authRateLimiter, oauthLogin);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/request-verification', authenticateJWT, authRateLimiter, requestVerification);
router.post('/verify-contact', authenticateJWT, authRateLimiter, verifyContact);
router.post('/2fa/generate', authenticateJWT, requireAdmin, generate2FA);
router.post('/2fa/verify', authenticateJWT, requireAdmin, verify2FA);

export default router;
