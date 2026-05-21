// API Route: PATCH /api/restaurante/codigos-qr/[uuid] - Activar/desactivar código QR
// Endpoint protegido (RESTAURANTE) para cambiar el estado activo de un código QR.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { CodigoQRAPIResponse } from '@/types/codigoqr';

function mapCodigoQRToPublico(record: {
  uuid: string;
  idMesa: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaExpiracion: Date | null;
}) {
  return {
    uuid: record.uuid,
    idMesa: record.idMesa,
    activo: record.activo,
    fechaCreacion: record.fechaCreacion.toISOString(),
    fechaExpiracion: record.fechaExpiracion?.toISOString() ?? null,
  };
}

// PATCH /api/restaurante/codigos-qr/[uuid] - Cambiar estado activo/inactivo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse<CodigoQRAPIResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'RESTAURANTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    // Parsear body
    let body: { activo?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON inválido en el cuerpo de la solicitud' },
        { status: 400 }
      );
    }

    const { activo } = body;

    // Validar activo
    if (typeof activo !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'El campo activo es requerido y debe ser un booleano' },
        { status: 400 }
      );
    }

    // Buscar el código QR por UUID Y restauranteId (scope)
    const codigoExistente = await prisma.codigoQR.findFirst({
      where: {
        uuid,
        restauranteId: userId,
      },
      select: {
        uuid: true,
        idMesa: true,
        activo: true,
        fechaCreacion: true,
        fechaExpiracion: true,
      },
    });

    if (!codigoExistente) {
      return NextResponse.json(
        { success: false, message: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar estado
    const codigoActualizado = await prisma.codigoQR.update({
      where: { uuid },
      data: { activo },
      select: {
        uuid: true,
        idMesa: true,
        activo: true,
        fechaCreacion: true,
        fechaExpiracion: true,
      },
    });

    const codigoPublico = mapCodigoQRToPublico(codigoActualizado);

    return NextResponse.json(
      {
        success: true,
        message: 'Estado del código QR actualizado',
        data: { codigo: codigoPublico },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar código QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
