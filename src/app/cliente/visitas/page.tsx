// Page: Mis Visitas - Listado de visitas del cliente
// Muestra visitas activas y completadas con opción de registrar salida

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: string; email: string; nombre: string; role: string; }

interface VisitaPublico {
  id: string;
  timestampEntrada: string;
  timestampSalida: string | null;
  duracionMinutos: number | null;
  estado: string;
  acompanantes: number;
  restaurante: { id: string; nombre: string };
  codigoQR: { uuid: string; idMesa: string };
}

type FilterTab = 'todas' | 'activas' | 'completadas';

function formatFecha(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m > 0 ? `${m}m` : ''}`;
}

export default function VisitasPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitas, setVisitas] = useState<VisitaPublico[]>([]);
  const [filter, setFilter] = useState<FilterTab>('todas');
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [restaurantesValorados, setRestaurantesValorados] = useState<Set<string>>(new Set());
  const [salidaLoading, setSalidaLoading] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [salidaError, setSalidaError] = useState('');
  const limit = 20;

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.data?.user?.role !== 'CLIENTE') { router.push('/'); return; }
        setUser(data.data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch visitas
  const fetchVisitas = useCallback(async (estadoFiltro: FilterTab, pageNum: number) => {
    setFetching(true);
    setError('');
    try {
      let url = `/api/cliente/visitas?page=${pageNum}&limit=${limit}`;
      if (estadoFiltro === 'activas') url += '&estado=activa';
      if (estadoFiltro === 'completadas') url += '&estado=completada';

      const [visitasRes, valoracionesRes] = await Promise.all([
        fetch(url),
        fetch('/api/cliente/valoraciones/mias'),
      ]);

      const visitasData = await visitasRes.json();

      if (!visitasData.success) {
        setError(visitasData.message);
        return;
      }

      setVisitas(visitasData.data.visitas);
      setTotal(visitasData.data.total);

      const valoracionesData = await valoracionesRes.json();
      if (valoracionesData.success) {
        setRestaurantesValorados(new Set(valoracionesData.data.restaurantesIds));
      }
    } catch {
      setError('Error al cargar tus visitas');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchVisitas(filter, page);
  }, [user, filter, page, fetchVisitas]);

  // Registrar salida
  const handleRegistrarSalida = async (visitaId: string) => {
    setSalidaLoading(visitaId);
    setSalidaError('');
    try {
      const res = await fetch(`/api/cliente/visitas/${visitaId}`, {
        method: 'PATCH',
      });
      const data = await res.json();

      if (!data.success) {
        setSalidaError(data.message);
        return;
      }

      // Actualizar la visita en la lista con los datos devueltos
      setVisitas((prev) =>
        prev.map((v) => (v.id === visitaId ? data.data.visita : v))
      );
    } catch {
      setSalidaError('Error de conexión al registrar salida');
    } finally {
      setSalidaLoading(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'activas', label: 'Activas' },
    { key: 'completadas', label: 'Completadas' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Tus Visitas</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {fetching && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Cargando visitas...</p>
          </div>
        )}

        {/* Error state */}
        {error && !fetching && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
            <button
              onClick={() => fetchVisitas(filter, page)}
              className="ml-4 underline font-semibold hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Salida error */}
        {salidaError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {salidaError}
          </div>
        )}

        {/* Empty state */}
        {!fetching && !error && visitas.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-gray-600 text-lg mb-4">
              No tenés visitas registradas
            </p>
            <button
              onClick={() => router.push('/restaurantes')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Ver restaurantes
            </button>
          </div>
        )}

        {/* Visitas list */}
        {!fetching && visitas.length > 0 && (
          <>
            <div className="space-y-4">
              {visitas.map((visita) => (
                <div key={visita.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {visita.restaurante.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mesa: {visita.codigoQR.idMesa}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        visita.estado === 'activa'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {visita.estado === 'activa' ? 'Activa' : 'Completada'}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 border-t pt-3">
                    <p>
                      <span className="font-medium">Entrada:</span>{' '}
                      {formatFecha(visita.timestampEntrada)}
                    </p>
                    {visita.timestampSalida && (
                      <p>
                        <span className="font-medium">Salida:</span>{' '}
                        {formatFecha(visita.timestampSalida)}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Acompañantes:</span>{' '}
                      {visita.acompanantes}
                    </p>
                    {visita.duracionMinutos !== null && (
                      <p>
                        <span className="font-medium">Duración:</span>{' '}
                        {formatDuracion(visita.duracionMinutos)}
                      </p>
                    )}
                  </div>

                  {visita.estado === 'activa' && (
                    <button
                      onClick={() => handleRegistrarSalida(visita.id)}
                      disabled={salidaLoading === visita.id}
                      className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {salidaLoading === visita.id
                        ? 'Registrando salida...'
                        : 'Registrar Salida'}
                    </button>
                  )}

                  {visita.estado === 'completada' && !restaurantesValorados.has(visita.restaurante.id) && (
                    <Link
                      href={`/cliente/valorar/${visita.restaurante.id}`}
                      className="mt-3 inline-block w-full text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors font-medium"
                    >
                      Valorá este restaurante
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      p === page
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
