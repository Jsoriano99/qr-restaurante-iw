// API Route: GET /api/codigos-qr/[uuid]/imagen - Obtener imagen SVG del código QR
// Endpoint público para obtener la imagen SVG de un código QR.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signQR } from '@/lib/qr-signing';
import { generateQRSvg } from '@/lib/qr-generator';

// GET /api/codigos-qr/[uuid]/imagen - Obtener SVG del código QR
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
  try {
    const { uuid } = await params;

    const codigo = await prisma.codigoQR.findFirst({
      where: { uuid, activo: true },
      select: {
        uuid: true,
        idMesa: true,
        fechaExpiracion: true,
      },
    });

    if (!codigo) {
      return NextResponse.json(
        { success: false, message: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    const fechaExpiracionStr = codigo.fechaExpiracion?.toISOString();

    const firma = signQR({
      uuid: codigo.uuid,
      idMesa: codigo.idMesa,
      fechaExpiracion: fechaExpiracionStr ?? undefined,
    });

    const svg = await generateQRSvg(
      codigo.uuid,
      codigo.idMesa,
      firma,
      fechaExpiracionStr ?? undefined
    );

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error al obtener imagen del código QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
