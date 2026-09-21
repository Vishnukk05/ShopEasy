import express from 'express';
import { register, login, oauthLogin, verifyOtp, updateProfile, requestVerification, verifyContact, forgotPassword, resetPassword } from '../controllers/auth';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/oauth', oauthLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/request-verification', authenticateJWT, requestVerification);
router.post('/verify-contact', authenticateJWT, verifyContact);

export default router;
