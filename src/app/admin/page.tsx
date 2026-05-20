'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User { id: string; email: string; nombre: string; role: string; }

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.data?.user?.role !== 'ADMIN') { router.push('/'); return; }
        setUser(data.data.user);
      } catch { router.push('/login'); } finally { setLoading(false); }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin - QR Restaurante</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-600">Cerrar Sesión</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">Gestión de Usuarios</h3><p className="text-gray-600">Administrar clientes y restaurantes</p></div>
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">Estadísticas</h3><p className="text-gray-600">Ver métricas del sistema</p></div>
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">Configuración</h3><p className="text-gray-600">Ajustes del sistema</p></div>
        </div>
      </main>
    </div>
  );
}