import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleGuard } from '../../middlewares/roleGuard';
import { ReportsController } from './reports.controller';

const router = Router();
const controller = new ReportsController();

router.get(
  '/low-stock',
  authMiddleware,
  roleGuard(['ADMIN']),
  controller.lowStock
);

export { router as reportsRoutes };