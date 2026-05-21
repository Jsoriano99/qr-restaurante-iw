// API Route: PATCH /api/cliente/visitas/[id] - Registrar salida de visita
// Endpoint protegido (CLIENTE) para finalizar una visita activa.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { VisitaPublico, VisitaAPIResponse } from '@/types/visita';

function mapVisitaToPublico(visita: {
  id: string;
  timestampEntrada: Date;
  timestampSalida: Date | null;
  duracionMinutos: number | null;
  estado: string;
  acompanantes: number;
  restaurante: { id: string; nombre: string };
  codigoQR: { uuid: string; idMesa: string };
}): VisitaPublico {
  return {
    id: visita.id,
    timestampEntrada: visita.timestampEntrada.toISOString(),
    timestampSalida: visita.timestampSalida?.toISOString() ?? null,
    duracionMinutos: visita.duracionMinutos,
    estado: visita.estado,
    acompanantes: visita.acompanantes,
    restaurante: visita.restaurante,
    codigoQR: visita.codigoQR,
  };
}

// PATCH /api/cliente/visitas/[id] - Registrar salida y finalizar visita
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<VisitaAPIResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'CLIENTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Buscar la visita y verificar que pertenece a este cliente
    const visitaExistente = await prisma.visita.findFirst({
      where: {
        id,
        clienteId: userId,
      },
      select: {
        id: true,
        estado: true,
        timestampEntrada: true,
        acompanantes: true,
        restauranteId: true,
      },
    });

    if (!visitaExistente) {
      return NextResponse.json(
        { success: false, message: 'Visita no encontrada' },
        { status: 404 }
      );
    }

    if (visitaExistente.estado === 'completada') {
      return NextResponse.json(
        { success: false, message: 'La visita ya fue finalizada' },
        { status: 400 }
      );
    }

    if (visitaExistente.estado !== 'activa') {
      return NextResponse.json(
        { success: false, message: 'La visita no está activa' },
        { status: 400 }
      );
    }

    // Calcular duración en minutos
    const ahora = new Date();
    const duracionMinutos = Math.round(
      (ahora.getTime() - visitaExistente.timestampEntrada.getTime()) / 60000
    );

    // Actualizar la visita
    const visitaActualizada = await prisma.visita.update({
      where: { id },
      data: {
        timestampSalida: ahora,
        duracionMinutos,
        estado: 'completada',
      },
      include: {
        restaurante: {
          select: { id: true, nombre: true },
        },
        codigoQR: {
          select: { uuid: true, idMesa: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Salida registrada exitosamente',
        data: { visita: mapVisitaToPublico(visitaActualizada) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al registrar salida:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
