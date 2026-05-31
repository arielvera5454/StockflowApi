import express from 'express';
import cors from 'cors';
import { errorHandler } from './errors/errorHandler';
import { authRoutes } from './features/auth/auth.routes';
import { productRoutes } from './features/products/product.routes';
import { orderRoutes } from './features/orders/order.routes';
import { reportsRoutes } from './features/reports/reports.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// Features
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportsRoutes);

// Manejador global de errores
app.use(errorHandler);

export default app;