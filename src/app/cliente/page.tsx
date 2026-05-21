'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User { id: string; email: string; nombre: string; role: string; }

interface VisitaActiva {
  id: string;
  restaurante: { nombre: string };
  codigoQR: { idMesa: string };
  timestampEntrada: string;
  acompanantes: number;
}

export default function ClientePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitaActiva, setVisitaActiva] = useState<VisitaActiva | null>(null);
  const [loadingVisita, setLoadingVisita] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.data?.user?.role !== 'CLIENTE') { router.push('/'); return; }
        setUser(data.data.user);
      } catch { router.push('/login'); } finally { setLoading(false); }
    };
    checkUser();
  }, [router]);

  // Fetch active visita
  useEffect(() => {
    if (!user) return;
    const fetchVisitaActiva = async () => {
      try {
        const res = await fetch('/api/cliente/visitas?estado=activa&limit=1');
        const data = await res.json();
        if (data.success && data.data.visitas.length > 0) {
          setVisitaActiva(data.data.visitas[0]);
        }
      } catch {
        // Silently fail — no es crítico
      } finally {
        setLoadingVisita(false);
      }
    };
    fetchVisitaActiva();
  }, [user]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Cliente - QR Restaurante</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-600 transition-colors">Cerrar Sesión</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {/* Visita activa banner */}
        {!loadingVisita && visitaActiva && (
          <Link
            href="/cliente/visitas"
            className="block bg-green-50 border border-green-300 p-6 rounded-lg shadow mb-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="text-lg font-bold text-green-800">Tenés una visita activa</h3>
                <p className="text-green-700">
                  {visitaActiva.restaurante.nombre} — Mesa {visitaActiva.codigoQR.idMesa}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/cliente/escanear"
            className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold mb-2">📷 Escaneá un QR</h3>
            <p className="text-gray-600">Escaneá el código QR de un restaurante para registrar tu entrada</p>
          </Link>
          <Link
            href="/cliente/visitas"
            className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold mb-2">📋 Tus Visitas</h3>
            <p className="text-gray-600">Historial completo de tus visitas a restaurantes</p>
          </Link>
        </div>

        {/* Restaurantes */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Explorá Restaurantes</h2>
          <Link
            href="/restaurantes"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Ver Todos
          </Link>
        </div>
        <Link
          href="/restaurantes"
          className="block bg-white p-6 rounded-lg shadow mb-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-bold mb-2">🔍 Explorar Restaurantes</h3>
          <p className="text-gray-600">Ver todos los restaurantes disponibles y sus menús</p>
        </Link>

        {/* Cards adicionales */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="#" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2">🛒 Mis Pedidos</h3>
            <p className="text-gray-600">Ver historial de pedidos</p>
          </Link>
          <Link href="#" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2">❤️ Mis Favoritos</h3>
            <p className="text-gray-600">Restaurantes guardados</p>
          </Link>
          <Link href="#" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2">👤 Mi Perfil</h3>
            <p className="text-gray-600">Editar información personal</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
