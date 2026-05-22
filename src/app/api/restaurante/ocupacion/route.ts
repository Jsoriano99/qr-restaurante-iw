// API Route: GET /api/restaurante/ocupacion - Control de aforo
// Endpoint protegido (RESTAURANTE) para consultar la ocupación actual del restaurante.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { OcupacionResponse, OcupacionData } from '@/types/visita';

// GET /api/restaurante/ocupacion - Obtener datos de ocupación
export async function GET(
  request: NextRequest
): Promise<NextResponse<OcupacionResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'RESTAURANTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener capacidad máxima del restaurante
    const restaurante = await prisma.restaurante.findUnique({
      where: { id: userId },
      select: { capacidadMaxima: true },
    });

    if (!restaurante) {
      return NextResponse.json(
        { success: false, message: 'Restaurante no encontrado' },
        { status: 404 }
      );
    }

    const { capacidadMaxima } = restaurante;

    // Contar visitas activas y sumar acompañantes
    const visitasActivas = await prisma.visita.count({
      where: {
        restauranteId: userId,
        estado: 'activa',
      },
    });

    const visitasConAcompanantes = await prisma.visita.findMany({
      where: {
        restauranteId: userId,
        estado: 'activa',
      },
      select: { acompanantes: true },
    });

    const sumaAcompanantes = visitasConAcompanantes.reduce(
      (total, visita) => total + visita.acompanantes,
      0
    );

    // Calcular métricas de ocupación
    const ocupacionActual = visitasActivas + sumaAcompanantes;
    const porcentajeOcupacion =
      capacidadMaxima > 0
        ? Math.round((ocupacionActual / capacidadMaxima) * 100)
        : 0;
    const plazasDisponibles: number | null =
      capacidadMaxima > 0
        ? Math.max(0, capacidadMaxima - ocupacionActual)
        : null;
    const alerta80 = capacidadMaxima > 0 && porcentajeOcupacion >= 80;
    const alerta100 = capacidadMaxima > 0 && porcentajeOcupacion >= 100;

    const ocupacion: OcupacionData = {
      restauranteId: userId,
      capacidadMaxima,
      ocupacionActual,
      plazasDisponibles,
      visitasActivas,
      porcentajeOcupacion,
      alerta80,
      alerta100,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Ocupación obtenida exitosamente',
        data: { ocupacion },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener ocupación:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
