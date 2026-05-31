import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleGuard } from '../../middlewares/roleGuard';
import {
  createProductSchema,
  updateProductSchema,
  getProductParamsSchema,
  productQuerySchema,
} from './product.validation';
import { ProductController } from './product.controller';

const router = Router();
const controller = new ProductController();

// Rutas públicas
router.get('/', validateRequest(productQuerySchema), controller.getAll);
router.get('/:id', validateRequest(getProductParamsSchema), controller.getById);

// Rutas protegidas (ADMIN)
router.post(
  '/',
  authMiddleware,
  roleGuard(['ADMIN']),
  validateRequest(createProductSchema),
  controller.create
);
router.put(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN']),
  validateRequest(updateProductSchema),
  controller.update
);
router.delete(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN']),
  validateRequest(getProductParamsSchema),
  controller.delete
);

export { router as productRoutes };