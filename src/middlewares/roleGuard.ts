import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { UserRole } from '../types';

export const roleGuard = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Autenticación requerida', 401));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403));
    }

    next();
  };
};