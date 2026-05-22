'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OcupacionData } from '@/types/visita';
import QrManager from '@/components/restaurante/QrManager';
import OccupancyGauge from '@/components/restaurante/OccupancyGauge';
import DashboardKPIs from '@/components/restaurante/DashboardKPIs';
import DashboardAlerts from '@/components/restaurante/DashboardAlerts';

interface User { id: string; email: string; nombre: string; role: string; }

interface OcupacionState {
  data: OcupacionData | null;
  loading: boolean;
  error: string;
}

export default function RestaurantePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ocupacion, setOcupacion] = useState<OcupacionState>({
    data: null,
    loading: true,
    error: '',
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.data?.user?.role !== 'RESTAURANTE') { router.push('/'); return; }
        setUser(data.data.user);
      } catch { router.push('/login'); } finally { setLoading(false); }
    };
    checkUser();
  }, [router]);

  // ── Polling de ocupación cada 15 segundos ──
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchOcupacion = async () => {
      setRefreshing(true);
      try {
        const res = await fetch('/api/restaurante/ocupacion');
        if (!res.ok) throw new Error('Error al obtener la ocupación');
        const json: { success: boolean; data?: { ocupacion: OcupacionData } } = await res.json();
        if (!json.success || !json.data?.ocupacion) throw new Error('Respuesta inválida del servidor');
        setOcupacion({ data: json.data.ocupacion, loading: false, error: '' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setOcupacion((prev) => ({ ...prev, loading: false, error: msg }));
      } finally {
        setRefreshing(false);
      }
    };

    fetchOcupacion();
    const interval = setInterval(fetchOcupacion, 15_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Restaurante - Panel de Control</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="bg-green-700 px-4 py-2 rounded hover:bg-green-600">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* ── Dashboard de Ocupación ── */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>

          {/* Loading state */}
          {ocupacion.loading && !ocupacion.data && (
            <p className="text-gray-500">Cargando datos de ocupación...</p>
          )}

          {/* Error state (only when there's no data) */}
          {ocupacion.error && !ocupacion.data && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {ocupacion.error}
            </div>
          )}

          {/* Dashboard content */}
          {ocupacion.data && (
            <div className="space-y-6">
              <DashboardAlerts ocupacion={ocupacion.data} />
              <DashboardKPIs ocupacion={ocupacion.data} />
              <OccupancyGauge ocupacion={ocupacion.data} />

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className={`inline-block w-2 h-2 rounded-full transition-colors duration-300 ${refreshing ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>
                  {refreshing ? 'Actualizando...' : 'Actualizado automáticamente cada 15s'}
                </span>
              </div>
            </div>
          )}
        </section>

        <hr />

        {/* ── Gestión de Códigos QR ── */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Gestión de Códigos QR</h2>
          <QrManager />
        </section>
      </main>
    </div>
  );
}