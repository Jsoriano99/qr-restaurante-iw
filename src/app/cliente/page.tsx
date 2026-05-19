'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User { id: string; email: string; nombre: string; role: string; }

export default function ClientePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.user.role !== 'CLIENTE') { router.push('/'); return; }
        setUser(data.user);
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
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Cliente - QR Restaurante</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-600">Cerrar Sesión</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Explora Restaurantes</h2>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-bold mb-2">📷 Escanea un QR</h3>
          <p className="text-gray-600">Escanea el código QR de tu mesa para ver el menú del restaurante</p>
          <p className="text-sm text-gray-500 mt-2">(En una app móvil, usarías la cámara del dispositivo)</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">🛒 Mis Pedidos</h3><p className="text-gray-600">Ver historial de pedidos</p></div>
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">❤️ Mis Favoritos</h3><p className="text-gray-600">Restaurantes guardados</p></div>
          <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-lg font-bold mb-2">👤 Mi Perfil</h3><p className="text-gray-600">Editar información personal</p></div>
        </div>
      </main>
    </div>
  );
}