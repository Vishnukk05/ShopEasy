import request from 'supertest';
import express from 'express';
jest.mock('ioredis', () => { return jest.fn().mockImplementation(() => ({ on: jest.fn(), get: jest.fn(), set: jest.fn(), call: jest.fn() })); });
import paymentRoutes from '../src/routes/payment';

const app = express();
app.use(express.json());
app.use('/api/payment', paymentRoutes);

describe('Payment Webhooks API', () => {
  it('should return 401 if x-provider-signature is missing', async () => {
    const res = await request(app)
      .post('/api/payment/webhook')
      .send({
        providerId: 'pay_123',
        status: 'SUCCESS',
        eventType: 'payment.captured',
      });
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Missing webhook signature');
  });

  // More tests to mock prisma and verify idempotency can go here
});
