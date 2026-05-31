import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleGuard } from '../../middlewares/roleGuard';
import {createOrderSchema,orderIdParamSchema,updateOrderStatusSchema,} from './order.validation';
import { OrderController } from './order.controller';

const router = Router();
const controller = new OrderController();

router.post(
  '/',
  authMiddleware,
  validateRequest(createOrderSchema),
  controller.create
);

router.get(
  '/:id',
  authMiddleware,
  validateRequest(orderIdParamSchema),
  controller.getById
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleGuard(['ADMIN']),
  validateRequest(updateOrderStatusSchema),
  controller.updateStatus
);

export { router as orderRoutes };