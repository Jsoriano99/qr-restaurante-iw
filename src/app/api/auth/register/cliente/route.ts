// Registro de Cliente - API Route

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import type { RegisterClienteBody, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterClienteBody = await request.json();

    if (!body.email || !body.password || !body.nombre) {
      return NextResponse.json(
        { success: false, message: 'Email, contraseña y nombre son requeridos' } as AuthResponse,
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Formato de email inválido' } as AuthResponse,
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(body.password)) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número' } as AuthResponse,
        { status: 400 }
      );
    }

    const existingCliente = await prisma.cliente.findUnique({
      where: { email: body.email },
    });

    if (existingCliente) {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado' } as AuthResponse,
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const cliente = await prisma.cliente.create({
      data: {
        email: body.email,
        password: hashedPassword,
        nombre: body.nombre,
        telefono: body.telefono || null,
        role: 'CLIENTE',
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cliente registrado exitosamente',
        data: {
          user: {
            id: cliente.id,
            email: cliente.email,
            nombre: cliente.nombre,
            role: cliente.role,
          },
        },
      } as AuthResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro de cliente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}