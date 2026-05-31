import { z } from 'zod';

export const createProductSchema = {
  body: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    sku: z.string().min(1, 'El SKU es requerido'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo'),
    minStock: z.number().int().min(0, 'El stock mínimo no puede ser negativo').default(0),
    price: z.number().positive('El precio debe ser mayor a 0'),
    categoryId: z.number().int().positive('La categoría es requerida'),
  }).strict(),
};

export const updateProductSchema = {
  body: z.object({
    name: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
    minStock: z.number().int().min(0).optional(),
    price: z.number().positive().optional(),
    categoryId: z.number().int().positive().optional(),
  }).strict(),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número'),
  }),
};

export const getProductParamsSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID debe ser un número'),
  }),
};

export const productQuerySchema = {
  query: z.object({
    category: z.string().optional(),
  }),
};