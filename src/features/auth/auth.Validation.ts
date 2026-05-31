import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres');

export const registerSchema = {
  body: z.object({
    email: z.string().email('Debe ser un email válido'),
    password: passwordSchema,
    role: z.enum(['ADMIN', 'OPERATOR']).optional(),
  }).strict(),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }).strict(),
};