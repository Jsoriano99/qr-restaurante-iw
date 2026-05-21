// Restaurante Detail Page - Página pública de detalle de restaurante con códigos QR
// Esta página muestra la información de un restaurante y sus códigos QR activos.
// Los usuarios pueden escanear un código QR para registrar su visita.
// Es un server component que obtiene los datos directamente de Prisma.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const restaurante = await prisma.restaurante.findUnique({
    where: { id },
    select: { nombre: true },
  });

  if (!restaurante) {
    return { title: 'Restaurante no encontrado - QR Restaurante' };
  }

  return {
    title: `${restaurante.nombre} - QR Restaurante`,
    description: `Escaneá un código QR para registrar tu visita a ${restaurante.nombre}`,
  };
}

export default async function RestauranteDetailPage({ params }: Props) {
  const { id } = await params;

  const restaurante = await prisma.restaurante.findUnique({
    where: { id },
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
      codigosQR: {
        where: { activo: true },
        select: {
          uuid: true,
          idMesa: true,
          activo: true,
        },
        orderBy: { idMesa: 'asc' },
      },
    },
  });

  if (!restaurante) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:underline">
            QR Restaurante
          </Link>
          <nav className="space-x-4">
            <Link href="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="hover:underline">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Link
          href="/restaurantes"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors font-medium"
        >
          ← Volver al listado
        </Link>

        {/* Información del restaurante */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            {restaurante.nombre}
          </h1>

          {restaurante.tipoCocina && (
            <p className="text-orange-600 font-medium mb-4">
              {restaurante.tipoCocina}
            </p>
          )}

          <div className="space-y-2 text-gray-600">
            <p className="flex items-start gap-2">
              <span aria-hidden="true">📍</span>
              <span>{restaurante.direccion}</span>
            </p>
            <p className="flex items-center gap-2">
              <span aria-hidden="true">📞</span>
              <a
                href={`tel:${restaurante.telefono}`}
                className="hover:text-orange-600 transition-colors"
              >
                {restaurante.telefono}
              </a>
            </p>
            {restaurante.horarios && (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <span aria-hidden="true">🕐</span>
                <span>{restaurante.horarios}</span>
              </p>
            )}
            {restaurante.capacidadMaxima > 0 && (
              <p className="flex items-center gap-2">
                <span aria-hidden="true">👥</span>
                <span>Capacidad: {restaurante.capacidadMaxima} personas</span>
              </p>
            )}
            {(restaurante.horarioApertura || restaurante.horarioCierre) && (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <span aria-hidden="true">⏰</span>
                <span>
                  {restaurante.horarioApertura ?? '—'} — {restaurante.horarioCierre ?? '—'}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Sección de códigos QR */}
        <section>
          <h2 className="text-xl font-bold mb-1 text-gray-800">
            Códigos QR
          </h2>
          <p className="text-gray-600 mb-6">
            Escaneá un código QR para registrar tu visita
          </p>

          {restaurante.codigosQR.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4" aria-hidden="true">📱</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Este restaurante todavía no tiene códigos QR disponibles
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurante.codigosQR.map((codigo) => (
                <article
                  key={codigo.uuid}
                  className="bg-white p-6 rounded-lg shadow flex flex-col items-center"
                  aria-label={`Código QR mesa ${codigo.idMesa}`}
                >
                  <img
                    src={`/api/codigos-qr/${codigo.uuid}/imagen`}
                    alt={`Código QR de mesa ${codigo.idMesa}`}
                    className="w-full max-w-[180px] h-auto mb-4 p-2 border border-gray-200 rounded-lg bg-white"
                  />

                  <p className="text-center font-medium text-gray-800 mb-2">
                    Mesa {codigo.idMesa}
                  </p>

                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" aria-hidden="true" />
                    Activo
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
