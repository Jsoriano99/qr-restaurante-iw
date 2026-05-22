// API Route: GET /api/restaurantes/[id]/valoraciones - Listado público de valoraciones
// Endpoint público para obtener las valoraciones de un restaurante, su promedio y total.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ValoracionesPublicasResponse } from '@/types/valoracion';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ValoracionesPublicasResponse>> {
  try {
    const { id: restauranteId } = await params;

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

    // Obtener valoraciones y estadísticas en paralelo
    const [valoraciones, aggregate] = await Promise.all([
      prisma.valoracion.findMany({
        where: { restauranteId },
        include: {
          cliente: {
            select: { id: true, nombre: true },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.valoracion.aggregate({
        where: { restauranteId },
        _avg: { puntuacion: true },
        _count: true,
      }),
    ]);

    const valoracionesPublicas = valoraciones.map((v) => ({
      id: v.id,
      puntuacion: v.puntuacion,
      comentario: v.comentario,
      timestamp: v.timestamp.toISOString(),
      cliente: v.cliente,
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Valoraciones obtenidas exitosamente',
        data: {
          valoraciones: valoracionesPublicas,
          valoracionMedia: Math.round((aggregate._avg.puntuacion ?? 0) * 100) / 100,
          totalValoraciones: aggregate._count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener valoraciones:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
