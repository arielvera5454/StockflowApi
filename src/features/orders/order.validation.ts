import { z } from 'zod';

export const createOrderSchema = {
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.number().int().positive('El productId debe ser positivo'),
          quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
        })
      )
      .min(1, 'El pedido debe tener al menos un producto'),
  }).strict(),
};

export const orderIdParamSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número'),
  }),
};

export const updateOrderStatusSchema = {
  body: z.object({
    status: z.enum(['DISPATCHED', 'CANCELLED'], {
      message: 'El estado debe ser DISPATCHED o CANCELLED',
    }),
  }).strict(),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número'),
  }),
};