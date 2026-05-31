import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { config } from '../../config';
import { AppError } from '../../errors/AppError';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario (role por defecto OPERATOR si no se envía)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || 'OPERATOR',
      },
    });

    // Generar token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
      { id: userId, email, role },
      config.jwtSecret,
      { expiresIn: '2h' }
    );
  }
}