// Refresh Token - API Route

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import type { RefreshBody, AuthResponse, JWTPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret-temporal');

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
    const body: RefreshBody = await request.json();

    if (!body.refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token requerido' } as AuthResponse,
        { status: 400 }
      );
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: body.refreshToken },
      include: { cliente: true, restaurante: true, administrador: true },
    });

    if (!storedToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token inválido' } as AuthResponse,
        { status: 401 }
      );
    }

    if (storedToken.revoked) {
      return NextResponse.json(
        { success: false, message: 'Refresh token revocado' } as AuthResponse,
        { status: 401 }
      );
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
      return NextResponse.json(
        { success: false, message: 'Refresh token expirado' } as AuthResponse,
        { status: 401 }
      );
    }

    const user = storedToken.cliente || storedToken.restaurante || storedToken.administrador;
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' } as AuthResponse,
        { status: 401 }
      );
    }

    const jwtPayload: JWTPayload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role as 'CLIENTE' | 'RESTAURANTE' | 'ADMIN',
    };

    const newAccessToken = await generateAccessToken(jwtPayload);
    const newRefreshToken = await generateRefreshToken();

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let tipo: 'clienteId' | 'restauranteId' | 'administradorId' = 'clienteId';
    if (storedToken.restauranteId) tipo = 'restauranteId';
    if (storedToken.administradorId) tipo = 'administradorId';

    await prisma.refreshToken.create({
      data: { token: newRefreshToken, expiresAt, [tipo]: user.id },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Token refrescado',
        data: { user: jwtPayload, accessToken: newAccessToken, refreshToken: newRefreshToken },
      } as AuthResponse,
      { status: 200 }
    );

    response.cookies.set('auth-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en refresh:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}