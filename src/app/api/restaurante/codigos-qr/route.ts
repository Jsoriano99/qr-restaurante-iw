// API Route: GET|POST /api/restaurante/codigos-qr - Gestión de códigos QR
// Endpoint protegido (RESTAURANTE) para generar y listar códigos QR de mesas.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signQR } from '@/lib/qr-signing';
import { generateQRSvg } from '@/lib/qr-generator';
import type { CodigoQRPublico, CodigosQRResponse, CodigoQRAPIResponse } from '@/types/codigoqr';

function parseDateSafe(value: string): Date | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date;
}

function mapCodigoQRToPublico(record: {
  uuid: string;
  idMesa: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaExpiracion: Date | null;
}): CodigoQRPublico {
  return {
    uuid: record.uuid,
    idMesa: record.idMesa,
    activo: record.activo,
    fechaCreacion: record.fechaCreacion.toISOString(),
    fechaExpiracion: record.fechaExpiracion?.toISOString() ?? null,
  };
}

// GET /api/restaurante/codigos-qr - Listar códigos QR del restaurante
export async function GET(
  request: NextRequest
): Promise<NextResponse<CodigosQRResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'RESTAURANTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const codigos = await prisma.codigoQR.findMany({
      where: { restauranteId: userId },
      select: {
        uuid: true,
        idMesa: true,
        activo: true,
        fechaCreacion: true,
        fechaExpiracion: true,
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    const codigosPublicos = codigos.map(mapCodigoQRToPublico);

    return NextResponse.json(
      {
        success: true,
        message: 'Códigos QR obtenidos exitosamente',
        data: { codigos: codigosPublicos },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener códigos QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/restaurante/codigos-qr - Generar un nuevo código QR
export async function POST(
  request: NextRequest
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

    // Parsear body
    let body: { idMesa?: unknown; fechaExpiracion?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON inválido en el cuerpo de la solicitud' },
        { status: 400 }
      );
    }

    const { idMesa, fechaExpiracion } = body;

    // Validar idMesa
    if (typeof idMesa !== 'string' || idMesa.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'El campo idMesa es requerido y debe ser un texto no vacío' },
        { status: 400 }
      );
    }

    if (idMesa.length > 50) {
      return NextResponse.json(
        { success: false, message: 'El campo idMesa no puede superar los 50 caracteres' },
        { status: 400 }
      );
    }

    // Validar fechaExpiracion (opcional)
    let fechaExpiracionDate: Date | undefined;
    if (fechaExpiracion !== undefined && fechaExpiracion !== null) {
      if (typeof fechaExpiracion !== 'string') {
        return NextResponse.json(
          { success: false, message: 'El campo fechaExpiracion debe ser una fecha ISO válida' },
          { status: 400 }
        );
      }

      const parsed = parseDateSafe(fechaExpiracion);
      if (!parsed) {
        return NextResponse.json(
          { success: false, message: 'El campo fechaExpiracion debe ser una fecha ISO válida' },
          { status: 400 }
        );
      }

      if (parsed <= new Date()) {
        return NextResponse.json(
          { success: false, message: 'La fecha de expiración debe ser una fecha futura' },
          { status: 400 }
        );
      }

      fechaExpiracionDate = parsed;
    }

    // Verificar duplicado: mesa activa existente para este restaurante
    const duplicado = await prisma.codigoQR.findFirst({
      where: {
        idMesa: idMesa.trim(),
        activo: true,
        restauranteId: userId,
      },
    });

    if (duplicado) {
      return NextResponse.json(
        {
          success: false,
          message: `Ya existe un código QR activo para la mesa ${idMesa.trim()}`,
        },
        { status: 409 }
      );
    }

    // Generar UUID y firma
    const uuid = crypto.randomUUID();
    const fechaExpiracionStr = fechaExpiracionDate?.toISOString();

    const signingPayload = {
      uuid,
      idMesa: idMesa.trim(),
      ...(fechaExpiracionStr ? { fechaExpiracion: fechaExpiracionStr } : {}),
    };

    const firma = signQR(signingPayload);

    // Guardar en base de datos
    const codigoCreado = await prisma.codigoQR.create({
      data: {
        uuid,
        idMesa: idMesa.trim(),
        activo: true,
        fechaCreacion: new Date(),
        fechaExpiracion: fechaExpiracionDate ?? null,
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

    // Generar SVG
    const imagenSvg = await generateQRSvg(
      uuid,
      idMesa.trim(),
      firma,
      fechaExpiracionStr
    );

    const codigoPublico = mapCodigoQRToPublico(codigoCreado);

    return NextResponse.json(
      {
        success: true,
        message: 'Código QR generado exitosamente',
        data: { codigo: codigoPublico, imagenSvg },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al generar código QR:', error);

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
