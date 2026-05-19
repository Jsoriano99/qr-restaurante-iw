// Tipos para autenticación - QR Restaurante

export type UserRole = 'CLIENTE' | 'RESTAURANTE' | 'ADMIN';
export type Rol = UserRole;

// Request Bodies
export interface RegisterClienteBody {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
}

export interface RegisterRestauranteBody {
  email: string;
  password: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horarios?: RestauranteHorarios;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RefreshBody {
  refreshToken: string;
}

// Response Bodies
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserPayload;
    accessToken?: string;
    refreshToken?: string;
    [key: string]: unknown;
  };
}

export interface UserPayload {
  id: string;
  email: string;
  nombre: string;
  role: Rol;
}

export interface JWTPayload {
  id: string;
  email: string;
  nombre: string;
  role: Rol;
}

export interface RestauranteHorarios {
  [dia: string]: {
    apertura: string;
    cierre: string;
    cerrado?: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}