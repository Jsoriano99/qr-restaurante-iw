'use client';

import type { OcupacionData } from '@/types/visita';

interface DashboardAlertsProps {
  ocupacion: OcupacionData;
}

export default function DashboardAlerts({ ocupacion }: DashboardAlertsProps) {
  const { alerta80, alerta100, porcentajeOcupacion } = ocupacion;

  if (alerta100) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">🚫 Aforo completo</p>
        <p className="text-sm">No se permiten más ingresos</p>
      </div>
    );
  }

  if (alerta80) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">⚠️ Aforo al {porcentajeOcupacion}%</p>
        <p className="text-sm">Próximo a completarse</p>
      </div>
    );
  }

  return null;
}
