// API Route: GET /api/restaurantes - Listado público de restaurantes
// Endpoint para obtener un listado de restaurantes con información básica (nombre, dirección, teléfono, horarios). Este endpoint es público y no requiere autenticación.

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { RestaurantesResponse } from '@/types/restaurante';

export async function GET(): Promise<NextResponse<RestaurantesResponse>> {
  try {
    const restaurantes = await prisma.restaurante.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        telefono: true,
        horarios: true,
        tipoCocina: true,
        capacidadMaxima: true,
        horarioApertura: true,
        horarioCierre: true,
        latitud: true,
        longitud: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurantes obtenidos',
        data: { restaurantes },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}
