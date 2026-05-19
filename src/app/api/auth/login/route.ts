// Login - API Route

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import type { LoginBody, AuthResponse, JWTPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret-temporal');

function getTokenExpiry(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

async function generateRefreshToken(): Promise<string> {
  return new SignJWT({ type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' } as AuthResponse,
        { status: 400 }
      );
    }

    let usuario: { id: string; email: string; password: string; nombre: string; role: string } | null = null;
    let tipo: 'clienteId' | 'restauranteId' | 'administradorId' = 'clienteId';

    const cliente = await prisma.cliente.findUnique({ where: { email: body.email } });
    if (cliente) {
      usuario = cliente;
      tipo = 'clienteId';
    }

    if (!usuario) {
      const restaurante = await prisma.restaurante.findUnique({ where: { email: body.email } });
      if (restaurante) {
        usuario = restaurante;
        tipo = 'restauranteId';
      }
    }

    if (!usuario) {
      const admin = await prisma.administrador.findUnique({ where: { email: body.email } });
      if (admin) {
        usuario = admin;
        tipo = 'administradorId';
      }
    }

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' } as AuthResponse,
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(body.password, usuario.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' } as AuthResponse,
        { status: 401 }
      );
    }

    const jwtPayload: JWTPayload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      role: usuario.role as 'CLIENTE' | 'RESTAURANTE' | 'ADMIN',
    };

    const accessToken = await generateAccessToken(jwtPayload);
    const refreshTokenValue = await generateRefreshToken();

    const expiresAt = getTokenExpiry(24 * 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        expiresAt,
        [tipo]: usuario.id,
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login exitoso',
        data: {
          user: jwtPayload,
          accessToken,
          refreshToken: refreshTokenValue,
        },
      } as AuthResponse,
      { status: 200 }
    );

    response.cookies.set('auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}