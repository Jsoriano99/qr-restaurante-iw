// Registro de Restaurante - API Route

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import type { RegisterRestauranteBody, AuthResponse, RestauranteHorarios } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRestauranteBody = await request.json();

    if (!body.email || !body.password || !body.nombre || !body.direccion || !body.telefono) {
      return NextResponse.json(
        { success: false, message: 'Email, contraseña, nombre, dirección y teléfono son requeridos' } as AuthResponse,
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

    if (body.horarios) {
      const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      for (const [dia, horario] of Object.entries(body.horarios as RestauranteHorarios)) {
        if (!diasValidos.includes(dia)) {
          return NextResponse.json(
            { success: false, message: `Día inválido: ${dia}` } as AuthResponse,
            { status: 400 }
          );
        }
        if (!horario.cerrado) {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(horario.apertura) || !timeRegex.test(horario.cierre)) {
            return NextResponse.json(
              { success: false, message: `Formato de hora inválido para ${dia}` } as AuthResponse,
              { status: 400 }
            );
          }
        }
      }
    }

    const existingRestaurante = await prisma.restaurante.findUnique({
      where: { email: body.email },
    });

    if (existingRestaurante) {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado' } as AuthResponse,
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const qrCode = `QR-${randomBytes(8).toString('hex').toUpperCase()}`;

    const restaurante = await prisma.restaurante.create({
      data: {
        email: body.email,
        password: hashedPassword,
        nombre: body.nombre,
        direccion: body.direccion,
        telefono: body.telefono,
        horarios: body.horarios ? JSON.stringify(body.horarios) : null,
        qrCode,
        role: 'RESTAURANTE',
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        qrCode: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurante registrado exitosamente',
        data: {
          user: {
            id: restaurante.id,
            email: restaurante.email,
            nombre: restaurante.nombre,
            role: restaurante.role,
          },
          qrCode: restaurante.qrCode,
        },
      } as AuthResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro de restaurante:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' } as AuthResponse,
      { status: 500 }
    );
  }
}