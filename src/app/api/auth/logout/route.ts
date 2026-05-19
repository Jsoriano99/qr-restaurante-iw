// Logout - API Route

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import type { AuthResponse } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret-temporal');

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const response = NextResponse.json(
        { success: true, message: 'Logout exitoso' } as AuthResponse,
        { status: 200 }
      );
      response.cookies.delete('auth-token');
      return response;
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userId = payload.id as string;

      await prisma.refreshToken.updateMany({
        where: {
          OR: [{ clienteId: userId }, { restauranteId: userId }, { administradorId: userId }],
        },
        data: { revoked: true },
      });
    } catch {}

    const response = NextResponse.json(
      { success: true, message: 'Logout exitoso' } as AuthResponse,
      { status: 200 }
    );

    response.cookies.delete('auth-token');
    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}