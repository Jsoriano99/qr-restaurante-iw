// Extensiones de tipos para NextAuth - QR Restaurante

import { JWT, DefaultSession } from 'next-auth';
import { Rol } from './auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      nombre: string;
      role: Rol;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    nombre: string;
    role: Rol;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    nombre: string;
    role: Rol;
  }
}