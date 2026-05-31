export interface RegisterInput {
  email: string;
  password: string;
  role?: string; // "ADMIN" | "OPERATOR" (opcional)
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
}