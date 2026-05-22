// API Route: POST /api/cliente/valoraciones - Crear valoración de restaurante
// Endpoint protegido (CLIENTE) para que un cliente valore un restaurante visitado.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { createValoracionSchema } from '@/types/valoracion';
import type { CreateValoracionAPIResponse } from '@/types/valoracion';

// POST /api/cliente/valoraciones - Crear una valoración
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateValoracionAPIResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'CLIENTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parsear y validar body con Zod
    let body;
    try {
      const rawBody = await request.json();
      const result = createValoracionSchema.safeParse(rawBody);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError =
          Object.values(fieldErrors).flat()[0] || 'Datos inválidos';
        return NextResponse.json(
          { success: false, message: firstError },
          { status: 400 }
        );
      }
      body = result.data;
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON inválido' },
        { status: 400 }
      );
    }

    const { restauranteId, puntuacion, comentario } = body;

    // Verificar que el restaurante existe
    const restaurante = await prisma.restaurante.findUnique({
      where: { id: restauranteId },
      select: { id: true },
    });

    if (!restaurante) {
      return NextResponse.json(
        { success: false, message: 'Restaurante no encontrado' },
        { status: 404 }
      );
    }

    // Crear la valoración
    const valoracion = await prisma.valoracion.create({
      data: {
        puntuacion,
        comentario: comentario ?? null,
        restauranteId,
        clienteId: userId,
      },
      include: {
        cliente: {
          select: { id: true, nombre: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Valoración creada exitosamente',
        data: {
          valoracion: {
            id: valoracion.id,
            puntuacion: valoracion.puntuacion,
            comentario: valoracion.comentario,
            timestamp: valoracion.timestamp.toISOString(),
            cliente: valoracion.cliente,
            restauranteId: valoracion.restauranteId,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            success: false,
            message: 'Ya valoraste este restaurante anteriormente',
          },
          { status: 409 }
        );
      }
    }

    console.error('Error al crear valoración:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
