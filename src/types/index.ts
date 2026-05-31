export type UserRole = 'ADMIN' | 'OPERATOR';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}