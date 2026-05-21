// API Route: GET /api/codigos-qr/[uuid]/validar - Validar código QR escaneado
// Endpoint público para validar la autenticidad y estado de un código QR.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyQR } from '@/lib/qr-signing';

// GET /api/codigos-qr/[uuid]/validar - Validar código QR
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
  try {
    const { uuid } = await params;

    const codigo = await prisma.codigoQR.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        idMesa: true,
        activo: true,
        fechaExpiracion: true,
        restaurante: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!codigo) {
      return NextResponse.json(
        { success: true, data: { valido: false, motivo: 'no_encontrado' } },
        { status: 200 }
      );
    }

    // Check 1: ¿El QR está activo?
    if (!codigo.activo) {
      return NextResponse.json(
        { success: true, data: { valido: false, motivo: 'inactivo' } },
        { status: 200 }
      );
    }

    // Check 2: ¿El QR está expirado?
    if (codigo.fechaExpiracion && new Date() > codigo.fechaExpiracion) {
      return NextResponse.json(
        { success: true, data: { valido: false, motivo: 'expirado' } },
        { status: 200 }
      );
    }

    // Check 3: Verificar HMAC
    const firma = request.nextUrl.searchParams.get('firma');

    if (!firma) {
      return NextResponse.json(
        { success: true, data: { valido: false, motivo: 'firma_invalida' } },
        { status: 200 }
      );
    }

    const fechaExpiracionStr = codigo.fechaExpiracion?.toISOString();

    const esFirmaValida = verifyQR(
      {
        uuid: codigo.uuid,
        idMesa: codigo.idMesa,
        fechaExpiracion: fechaExpiracionStr ?? undefined,
      },
      firma
    );

    if (!esFirmaValida) {
      return NextResponse.json(
        { success: true, data: { valido: false, motivo: 'firma_invalida' } },
        { status: 200 }
      );
    }

    // Todos los checks pasaron
    return NextResponse.json(
      {
        success: true,
        data: {
          valido: true,
          restaurante: {
            id: codigo.restaurante.id,
            nombre: codigo.restaurante.nombre,
          },
          idMesa: codigo.idMesa,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al validar código QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
