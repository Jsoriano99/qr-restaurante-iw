// Register Page - QR Restaurante

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type RegisterType = 'cliente' | 'restaurante';

export default function RegisterPage() {
  const router = useRouter();
  const [type, setType] = useState<RegisterType>('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [clienteData, setClienteData] = useState({ email: '', password: '', nombre: '', telefono: '' });
  const [restauranteData, setRestauranteData] = useState({ email: '', password: '', nombre: '', direccion: '', telefono: '' });

  const handleClienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleRestauranteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register/restaurante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restauranteData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">¡Registro exitoso!</h2>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">QR Restaurante - Registro</h1>

        <div className="flex mb-6 border-b">
          <button
            type="button"
            onClick={() => setType('cliente')}
            className={`flex-1 py-2 text-center font-medium ${type === 'cliente' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setType('restaurante')}
            className={`flex-1 py-2 text-center font-medium ${type === 'restaurante' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Restaurante
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {type === 'cliente' && (
          <form onSubmit={handleClienteSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" value={clienteData.email} onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input type="password" value={clienteData.password} onChange={(e) => setClienteData({ ...clienteData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Mín 8 caracteres, 1 mayúscula, 1 número" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input type="text" value={clienteData.nombre} onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono (opcional)</label>
              <input type="tel" value={clienteData.telefono} onChange={(e) => setClienteData({ ...clienteData, telefono: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Registrando...' : 'Registrarse como Cliente'}
            </button>
          </form>
        )}

        {type === 'restaurante' && (
          <form onSubmit={handleRestauranteSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" value={restauranteData.email} onChange={(e) => setRestauranteData({ ...restauranteData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input type="password" value={restauranteData.password} onChange={(e) => setRestauranteData({ ...restauranteData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Mín 8 caracteres, 1 mayúscula, 1 número" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Restaurante</label>
              <input type="text" value={restauranteData.nombre} onChange={(e) => setRestauranteData({ ...restauranteData, nombre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
              <input type="text" value={restauranteData.direccion} onChange={(e) => setRestauranteData({ ...restauranteData, direccion: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
              <input type="tel" value={restauranteData.telefono} onChange={(e) => setRestauranteData({ ...restauranteData, telefono: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Registrando...' : 'Registrarse como Restaurante'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 hover:underline">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
}