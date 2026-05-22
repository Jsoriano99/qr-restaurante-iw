// API Route: GET /api/cliente/valoraciones/mias - Valoraciones del cliente autenticado
// Endpoint protegido (CLIENTE) para obtener los IDs de restaurantes que ya valoró.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ValoracionesMiasResponse } from '@/types/valoracion';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ValoracionesMiasResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'CLIENTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const valoraciones = await prisma.valoracion.findMany({
      where: { clienteId: userId },
      select: { restauranteId: true },
    });

    const restaurantesIds = valoraciones.map((v) => v.restauranteId);

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurantes valorados obtenidos exitosamente',
        data: { restaurantesIds },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener valoraciones del cliente:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
