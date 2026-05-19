// Configuración de NextAuth - QR Restaurante

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

type UserRole = 'CLIENTE' | 'RESTAURANTE' | 'ADMIN';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña requeridos');
        }

        let usuario:
          | { id: string; email: string; password: string; nombre: string; role: UserRole; tipo: 'cliente' | 'restaurante' | 'admin' }
          | null = null;

        const cliente = await prisma.cliente.findUnique({
          where: { email: credentials.email },
        });
        if (cliente) {
          usuario = {
            id: cliente.id,
            email: cliente.email,
            password: cliente.password,
            nombre: cliente.nombre,
            role: cliente.role as UserRole,
            tipo: 'cliente',
          };
        }

        if (!usuario) {
          const restaurante = await prisma.restaurante.findUnique({
            where: { email: credentials.email },
          });
          if (restaurante) {
            usuario = {
              id: restaurante.id,
              email: restaurante.email,
              password: restaurante.password,
              nombre: restaurante.nombre,
              role: restaurante.role as UserRole,
              tipo: 'restaurante',
            };
          }
        }

        if (!usuario) {
          const admin = await prisma.administrador.findUnique({
            where: { email: credentials.email },
          });
          if (admin) {
            usuario = {
              id: admin.id,
              email: admin.email,
              password: admin.password,
              nombre: admin.nombre,
              role: admin.role as UserRole,
              tipo: 'admin',
            };
          }
        }

        if (!usuario) {
          throw new Error('Credenciales inválidas');
        }

        const isValid = await bcrypt.compare(credentials.password, usuario.password);
        if (!isValid) {
          throw new Error('Credenciales inválidas');
        }

        return {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          role: usuario.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nombre = user.nombre;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.nombre = token.nombre;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};