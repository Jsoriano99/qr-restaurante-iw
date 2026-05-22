// API Route: GET|POST /api/cliente/visitas - Gestión de visitas del cliente
// Endpoint protegido (CLIENTE) para registrar entrada y listar visitas.

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyQR } from '@/lib/qr-signing';
import { registrarEntradaSchema } from '@/types/visita';
import type { VisitaPublico, VisitaAPIResponse, VisitasListResponse, OcupacionData } from '@/types/visita';

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

async function calcularOcupacion(
  restauranteId: string,
  capacidadMaxima: number
): Promise<OcupacionData> {
  const visitasActivas = await prisma.visita.count({
    where: { restauranteId, estado: 'activa' },
  });

  const acompanantesSum = await prisma.visita.aggregate({
    where: { restauranteId, estado: 'activa' },
    _sum: { acompanantes: true },
  });

  const totalPersonas = visitasActivas + (acompanantesSum._sum.acompanantes ?? 0);
  const porcentaje =
    capacidadMaxima > 0 ? Math.round((totalPersonas / capacidadMaxima) * 100) : 0;

  return {
    restauranteId,
    capacidadMaxima,
    ocupacionActual: totalPersonas,
    plazasDisponibles: capacidadMaxima > 0 ? Math.max(0, capacidadMaxima - totalPersonas) : null,
    visitasActivas,
    porcentajeOcupacion: porcentaje,
    alerta80: capacidadMaxima > 0 && porcentaje >= 80,
    alerta100: capacidadMaxima > 0 && porcentaje >= 100,
  };
}

// POST /api/cliente/visitas - Registrar entrada (escaneo QR)
export async function POST(
  request: NextRequest
): Promise<NextResponse<VisitaAPIResponse>> {
  // Variables accesibles desde try y catch para datos de ocupación
  let restauranteId = '';
  let capacidadMaxima = 0;

  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'CLIENTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parsear y validar body con Zod
    let body;
    try {
      const rawBody = await request.json();
      const result = registrarEntradaSchema.safeParse(rawBody);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError = Object.values(fieldErrors).flat()[0] || 'Datos inválidos';
        return NextResponse.json(
          { success: false, message: firstError },
          { status: 400 }
        );
      }
      body = result.data;
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON inválido en el cuerpo de la solicitud' },
        { status: 400 }
      );
    }

    const { codigoQRUuid, firma, acompanantes } = body;

    // Consultar código QR en BD
    const codigo = await prisma.codigoQR.findUnique({
      where: { uuid: codigoQRUuid },
      select: {
        uuid: true,
        idMesa: true,
        activo: true,
        fechaExpiracion: true,
        restauranteId: true,
        restaurante: {
          select: {
            id: true,
            nombre: true,
            capacidadMaxima: true,
          },
        },
      },
    });

    // Validar que el QR existe
    if (!codigo) {
      return NextResponse.json(
        { success: false, message: 'Código QR no encontrado' },
        { status: 404 }
      );
    }

    // Validar que el QR está activo
    if (!codigo.activo) {
      return NextResponse.json(
        { success: false, message: 'El código QR está inactivo' },
        { status: 400 }
      );
    }

    // Validar que el QR no ha expirado
    if (codigo.fechaExpiracion && new Date() > codigo.fechaExpiracion) {
      return NextResponse.json(
        { success: false, message: 'El código QR ha expirado' },
        { status: 400 }
      );
    }

    // Verificar firma HMAC
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
        { success: false, message: 'Firma HMAC inválida. El código QR no es auténtico.' },
        { status: 400 }
      );
    }

    // Guardar datos del restaurante para usarlos en try y catch
    restauranteId = codigo.restauranteId;
    capacidadMaxima = codigo.restaurante.capacidadMaxima;

    // Transacción: verificar duplicado activo + aforo + crear visita
    const visita = await prisma.$transaction(async (tx) => {
      // Verificar que el cliente no tenga ya una visita activa en este restaurante
      const activaExistente = await tx.visita.findFirst({
        where: {
          clienteId: userId,
          restauranteId: codigo.restauranteId,
          estado: 'activa',
        },
      });

      if (activaExistente) {
        throw new Error('DUPLICADO_ACTIVO');
      }

      // Calcular ocupación actual del restaurante
      const visitasActivas = await tx.visita.findMany({
        where: {
          restauranteId: codigo.restauranteId,
          estado: 'activa',
        },
        select: { acompanantes: true },
      });

      const ocupacionActual = visitasActivas.reduce(
        (sum, v) => sum + 1 + v.acompanantes,
        0
      );

      const capacidadMaxima = codigo.restaurante.capacidadMaxima;

      if (capacidadMaxima > 0 && ocupacionActual + 1 + acompanantes > capacidadMaxima) {
        throw new Error('AFORO_EXCEDIDO');
      }

      // Crear la visita
      const nuevaVisita = await tx.visita.create({
        data: {
          timestampEntrada: new Date(),
          estado: 'activa',
          acompanantes,
          restauranteId: codigo.restauranteId,
          clienteId: userId,
          codigoQRId: codigo.uuid,
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

      return nuevaVisita;
    });

    // Calcular ocupación después de la transacción
    const ocupacionData = await calcularOcupacion(
      codigo.restauranteId,
      codigo.restaurante.capacidadMaxima
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Visita registrada exitosamente',
        data: { visita: mapVisitaToPublico(visita), ocupacion: ocupacionData },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'DUPLICADO_ACTIVO') {
        return NextResponse.json(
          { success: false, message: 'Ya tenés una visita activa en este restaurante' },
          { status: 409 }
        );
      }
      if (error.message === 'AFORO_EXCEDIDO') {
        // Calcular ocupación para incluir en la respuesta de error
        const ocupacionData = await calcularOcupacion(
          restauranteId,
          capacidadMaxima
        );

        return NextResponse.json(
          {
            success: false,
            message: 'Aforo completo. No hay suficientes plazas disponibles.',
            data: { ocupacion: ocupacionData },
          },
          { status: 409 }
        );
      }
    }

    console.error('Error al registrar visita:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET /api/cliente/visitas - Listar visitas del cliente autenticado
export async function GET(
  request: NextRequest
): Promise<NextResponse<VisitasListResponse>> {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || userRole !== 'CLIENTE') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get('estado');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Construir filtro
    const where: { clienteId: string; estado?: string } = { clienteId: userId };
    if (estado === 'activa' || estado === 'completada') {
      where.estado = estado;
    }

    const [visitas, total] = await Promise.all([
      prisma.visita.findMany({
        where,
        include: {
          restaurante: {
            select: { id: true, nombre: true },
          },
          codigoQR: {
            select: { uuid: true, idMesa: true },
          },
        },
        orderBy: { timestampEntrada: 'desc' },
        skip,
        take: limit,
      }),
      prisma.visita.count({ where }),
    ]);

    const visitasPublicas = visitas.map(mapVisitaToPublico);

    return NextResponse.json(
      {
        success: true,
        message: 'Visitas obtenidas exitosamente',
        data: {
          visitas: visitasPublicas,
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
