// API Route: GET /api/codigos-qr/[uuid]/payload - Obtener payload del código QR
// Endpoint público para que clientes obtengan uuid y firma para probar el flujo de escaneo.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signQR } from '@/lib/qr-signing';

// GET /api/codigos-qr/[uuid]/payload - Obtener payload del código QR
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
  try {
    const { uuid } = await params;

    const codigo = await prisma.codigoQR.findFirst({
      where: {
        uuid,
        activo: true,
        OR: [
          { fechaExpiracion: null },
          { fechaExpiracion: { gte: new Date() } },
        ],
      },
      select: {
        uuid: true,
        idMesa: true,
        fechaExpiracion: true,
      },
    });

    if (!codigo) {
      return NextResponse.json(
        { success: false, message: 'Código QR no encontrado o expirado' },
        { status: 404 }
      );
    }

    const fechaExpiracionStr = codigo.fechaExpiracion?.toISOString();

    const firma = signQR({
      uuid: codigo.uuid,
      idMesa: codigo.idMesa,
      fechaExpiracion: fechaExpiracionStr ?? undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        uuid: codigo.uuid,
        idMesa: codigo.idMesa,
        firma,
        expiracion: fechaExpiracionStr ?? null,
      },
    });
  } catch (error) {
    console.error('Error al obtener payload del código QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
