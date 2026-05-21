'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QrManager from '@/components/restaurante/QrManager';

interface User { id: string; email: string; nombre: string; role: string; }

export default function RestaurantePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Restaurante - QR Restaurante</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
            <button onClick={handleLogout} className="bg-green-700 px-4 py-2 rounded hover:bg-green-600">Cerrar Sesión</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Gestión de Códigos QR</h2>
        <QrManager />
      </main>
    </div>
  );
}