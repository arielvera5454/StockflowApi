import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
};