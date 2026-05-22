'use client';

import type { OcupacionData } from '@/types/visita';

interface OccupancyGaugeProps {
  ocupacion: OcupacionData;
}

export default function OccupancyGauge({ ocupacion }: OccupancyGaugeProps) {
  const {
    capacidadMaxima,
    ocupacionActual,
    porcentajeOcupacion,
  } = ocupacion;

  // ── Sin límite de capacidad ──
  if (capacidadMaxima === 0) {
    return (
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Capacidad utilizada</h3>
        <p className="text-gray-500">Sin límite de capacidad</p>
      </section>
    );
  }

  // ── Determinar color según porcentaje ──
  const barColor =
    porcentajeOcupacion >= 100
      ? 'bg-red-600'
      : porcentajeOcupacion >= 80
        ? 'bg-yellow-500'
        : 'bg-green-500';

  const textColor =
    porcentajeOcupacion >= 100
      ? 'text-red-700'
      : porcentajeOcupacion >= 80
        ? 'text-yellow-700'
        : 'text-green-700';

  const clampedWidth = Math.min(porcentajeOcupacion, 100);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Capacidad utilizada</h3>

      {/* ── Barra de progreso ── */}
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>

      {/* ── Etiqueta del porcentaje ── */}
      <p className={`text-right text-sm font-semibold mt-1 ${textColor}`}>
        {porcentajeOcupacion}%
      </p>

      {/* ── Personas ── */}
      <p className="text-gray-600 text-sm mt-1">
        {ocupacionActual} / {capacidadMaxima} personas
      </p>
    </section>
  );
}
