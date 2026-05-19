// Get Current User - API Route

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import type { AuthResponse } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret-temporal');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' } as AuthResponse,
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;
    const userRole = payload.role as string;

    let user;
    if (userRole === 'CLIENTE') {
      user = await prisma.cliente.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nombre: true, role: true },
      });
    } else if (userRole === 'RESTAURANTE') {
      user = await prisma.restaurante.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nombre: true, role: true },
      });
    } else if (userRole === 'ADMIN') {
      user = await prisma.administrador.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nombre: true, role: true },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' } as AuthResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Usuario obtenido', data: { user } } as AuthResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en /me:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}