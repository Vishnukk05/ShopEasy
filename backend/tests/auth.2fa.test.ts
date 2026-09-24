import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';
import prisma from '../src/utils/db';
import bcrypt from 'bcryptjs';
jest.mock('ioredis', () => { return jest.fn().mockImplementation(() => ({ on: jest.fn(), get: jest.fn(), set: jest.fn(), call: jest.fn() })); });

// Mock prisma and notifications
jest.mock('../src/utils/db', () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  }
}));

jest.mock('../src/utils/notifications', () => ({
  generateOTP: jest.fn(() => '123456'),
  sendEmailOTP: jest.fn(),
  sendSmsOTP: jest.fn(),
  sendResetPasswordWithOTP: jest.fn(),
}));

// Setup app
const app = express();
app.use(express.json());
// Mock rate limiter by skipping it for tests (or we could let it run)
app.use('/api/auth', authRoutes);

describe('Auth & 2FA Enforcement API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should block login and return 401 require2FA if 2FA is enabled', async () => {
    const mockHash = await bcrypt.hash('password123', 1);
    
    // Mock user with 2FA enabled
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'user_1',
      email: 'admin@test.com',
      passwordHash: mockHash,
      roleId: 'admin_role',
      isTwoFactorEnabled: true,
      twoFactorSecret: 'MOCK_SECRET'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    
    expect(res.status).toBe(401);
    expect(res.body.require2FA).toBe(true);
    expect(res.body.token).toBeUndefined(); // Token MUST NOT be issued
  });

  it('should allow login with JWT if 2FA is NOT enabled', async () => {
    const mockHash = await bcrypt.hash('password123', 1);
    
    // Mock user with 2FA disabled
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'user_2',
      email: 'user@test.com',
      passwordHash: mockHash,
      roleId: 'customer_role',
      isTwoFactorEnabled: false,
    });

    // Mock env var
    process.env.JWT_SECRET = 'test_secret';

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.require2FA).toBeUndefined();
    expect(prisma.auditLog.create).toHaveBeenCalled(); // Should be audit logged
  });

  it('should block /login/2fa with invalid TOTP code and log it', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user_1',
      email: 'admin@test.com',
      roleId: 'admin_role',
      isTwoFactorEnabled: true,
      twoFactorSecret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' // Valid base32 mock secret
    });

    const res = await request(app)
      .post('/api/auth/login/2fa')
      .send({ userId: 'user_1', totpCode: '000000' }); // Wrong code
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid TOTP code');
    expect(res.body.token).toBeUndefined();

    // Verify audit log caught the failure
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        action: '2FA_LOGIN_FAILED'
      })
    }));
  });
});
