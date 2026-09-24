import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import adminRoutes from './routes/admin';
import addressRoutes from './routes/address';
import orderRoutes from './routes/order';
import dealsRoutes from './routes/deals';
import paymentRoutes from './routes/payment';
import rbacRoutes from './routes/rbac';
import variantRoutes from './routes/variant';
import inventoryRoutes from './routes/inventory';
import shippingRoutes from './routes/shipping';
import invoiceRoutes from './routes/invoice';
import reviewRoutes from './routes/review';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { securityMiddlewares } from './middlewares/security';
import analyticsRoutes from './routes/analytics';
import accountRoutes from './routes/account';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(securityMiddlewares); // Helmet, CORS, Rate Limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/public', express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/products', variantRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/account', accountRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

