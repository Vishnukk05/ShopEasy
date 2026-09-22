import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';
import { generateOTP, sendEmailOTP, sendSmsOTP, sendResetPasswordEmail } from '../utils/notifications';

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) return res.status(400).json({ message: 'Email already exists' });
    }
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) return res.status(400).json({ message: 'Phone already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        passwordHash,
        otpCode,
        otpExpiresAt
      },
    });

    if (email) await sendEmailOTP(email, otpCode);
    if (phone) await sendSmsOTP(phone, otpCode);

    res.status(201).json({ message: 'User created. Please verify OTP.', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, phone, password, requestOtp } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {}
        ].filter(obj => Object.keys(obj).length > 0) as any
      }
    });

    if (!user) return res.status(400).json({ message: 'User not found' });

    if (requestOtp) {
      const otpCode = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.user.update({ where: { id: user.id }, data: { otpCode, otpExpiresAt } });
      if (email && user.email) await sendEmailOTP(user.email, otpCode);
      if (phone && user.phone) await sendSmsOTP(user.phone, otpCode);
      return res.json({ message: 'OTP sent', userId: user.id });
    }

    if (password && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = generateToken(user.id, user.role);
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: user.isEmailVerified, isPhoneVerified: user.isPhoneVerified },
        token,
      });
    }

    return res.status(400).json({ message: 'Password required' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        isEmailVerified: user.email ? true : user.isEmailVerified,
        isPhoneVerified: user.phone ? true : user.isPhoneVerified,
      }
    });

    const token = generateToken(user.id, user.role);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: true },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const oauthLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { provider, providerId, email, name } = req.body;
    
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          provider === 'google' ? { googleId: providerId } : {},
          provider === 'facebook' ? { facebookId: providerId } : {},
          email ? { email } : {}
        ].filter(obj => Object.keys(obj).length > 0) as any
      }
    });

    if (!user) {
      if (!email || !name) return res.status(400).json({ message: 'Email and name required for new OAuth user' });
      user = await prisma.user.create({
        data: {
          name,
          email,
          isEmailVerified: true,
          googleId: provider === 'google' ? providerId : null,
          facebookId: provider === 'facebook' ? providerId : null
        }
      });
    } else {
      if (provider === 'google' && !user.googleId) {
         user = await prisma.user.update({ where: { id: user.id }, data: { googleId: providerId, isEmailVerified: true } });
      } else if (provider === 'facebook' && !user.facebookId) {
         user = await prisma.user.update({ where: { id: user.id }, data: { facebookId: providerId, isEmailVerified: true } });
      }
    }

    const token = generateToken(user.id, user.role);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: user.isEmailVerified, isPhoneVerified: user.isPhoneVerified },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { name, email, phone } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let isEmailVerified = user.isEmailVerified;
    let isPhoneVerified = user.isPhoneVerified;

    if (email !== undefined && email !== user.email) {
      isEmailVerified = false;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) return res.status(400).json({ message: 'Email already in use' });
    }
    if (phone !== undefined && phone !== user.phone) {
      isPhoneVerified = false;
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing && existing.id !== userId) return res.status(400).json({ message: 'Phone already in use' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { 
        name: name !== undefined ? name : user.name,
        email: email !== undefined ? email : user.email,
        phone: phone !== undefined ? phone : user.phone,
        isEmailVerified,
        isPhoneVerified
      }
    });

    res.json({
      user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role, isEmailVerified: updated.isEmailVerified, isPhoneVerified: updated.isPhoneVerified }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

export const requestVerification = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { contactType } = req.body; // 'email' or 'phone'
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({ where: { id: user.id }, data: { otpCode, otpExpiresAt } });

    if (contactType === 'email' && user.email) {
      await sendEmailOTP(user.email, otpCode);
    } else if (contactType === 'phone' && user.phone) {
      await sendSmsOTP(user.phone, otpCode);
    } else {
      return res.status(400).json({ message: `No ${contactType} on file` });
    }

    res.json({ message: 'Verification OTP sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error requesting verification' });
  }
};

export const verifyContact = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { contactType, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        isEmailVerified: contactType === 'email' ? true : user.isEmailVerified,
        isPhoneVerified: contactType === 'phone' ? true : user.isPhoneVerified
      }
    });

    res.json({
      user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role, isEmailVerified: updated.isEmailVerified, isPhoneVerified: updated.isPhoneVerified }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying contact' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) return res.status(400).json({ message: 'Email or phone required' });

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPhone = /^\+?\d+$/.test(emailOrPhone);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (isPhone && user.phone) {
      // Phone flow: Send 6-digit OTP
      const otpCode = generateOTP();
      await prisma.user.update({ where: { id: user.id }, data: { otpCode, otpExpiresAt } });
      await sendSmsOTP(user.phone, otpCode);
      return res.json({ type: 'phone', message: 'OTP sent to your phone', userId: user.id });
    } else if (user.email) {
      // Email flow: Send link with token
      const resetToken = crypto.randomBytes(32).toString('hex');
      await prisma.user.update({ where: { id: user.id }, data: { otpCode: resetToken, otpExpiresAt } });
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      await sendResetPasswordEmail(user.email, resetLink);
      return res.json({ type: 'email', message: 'Password reset link sent to your email', userId: user.id });
    } else {
      return res.status(400).json({ message: 'Account has no valid email or phone to reset' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, userId, otp, newPassword } = req.body;
    
    if (!newPassword) return res.status(400).json({ message: 'Missing new password' });

    let user;
    
    if (token) {
      // Email flow
      user = await prisma.user.findFirst({ where: { otpCode: token } });
      if (!user) return res.status(404).json({ message: 'Invalid or expired token' });
    } else if (userId && otp) {
      // Phone flow
      user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    } else {
      return res.status(400).json({ message: 'Missing token or OTP' });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset link or OTP has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        otpCode: null,
        otpExpiresAt: null
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};
