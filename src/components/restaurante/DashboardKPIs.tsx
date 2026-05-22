'use client';

import type { OcupacionData } from '@/types/visita';

interface DashboardKPIsProps {
  ocupacion: OcupacionData;
}

export default function DashboardKPIs({ ocupacion }: DashboardKPIsProps) {
  const {
    ocupacionActual,
    plazasDisponibles,
    porcentajeOcupacion,
    visitasActivas,
  } = ocupacion;

  // ── Color según porcentaje ──
  const porcentajeColor =
    porcentajeOcupacion >= 100
      ? 'text-red-600'
      : porcentajeOcupacion >= 80
        ? 'text-yellow-600'
        : 'text-green-600';

  const cards = [
    {
      label: 'Visitantes actuales',
      value: ocupacionActual,
      subtitle: 'incluye acompañantes',
      icon: '👥',
    },
    {
      label: 'Plazas disponibles',
      value: plazasDisponibles !== null ? plazasDisponibles : 'Ilimitadas',
      subtitle: plazasDisponibles !== null ? 'plazas libres' : 'sin restricción',
      icon: '🪑',
    },
    {
      label: 'Porcentaje de ocupación',
      value: `${porcentajeOcupacion}%`,
      subtitle: 'del aforo total',
      icon: null,
      customValueClass: porcentajeColor,
    },
    {
      label: 'Visitas activas',
      value: visitasActivas,
      subtitle: 'comensales en sala',
      icon: '📋',
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-6 rounded-lg shadow flex flex-col"
        >
          {card.icon && (
            <span className="text-2xl mb-2" aria-hidden="true">
              {card.icon}
            </span>
          )}
          <p className="text-sm text-gray-500 font-medium">{card.label}</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              card.customValueClass ?? 'text-gray-900'
            }`}
          >
            {card.value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
        </div>
      ))}
    </section>
  );
}
