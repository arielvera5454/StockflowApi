import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.Validation';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/register', validateRequest(registerSchema), controller.register);
router.post('/login', validateRequest(loginSchema), controller.login);

export { router as authRoutes };