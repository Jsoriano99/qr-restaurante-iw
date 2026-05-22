'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from './StarRating';

interface ValorarFormProps {
  restauranteId: string;
  restauranteNombre: string;
}

export default function ValorarForm({
  restauranteId,
  restauranteNombre,
}: ValorarFormProps) {
  const router = useRouter();
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.data?.user?.role !== 'CLIENTE') {
          router.push('/login');
          return;
        }
      } catch {
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (puntuacion === 0 || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/cliente/valoraciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restauranteId, puntuacion, comentario: comentario || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError('Ya valoraste este restaurante anteriormente');
        } else if (res.status === 400) {
          setError(data.message || 'Datos inválidos');
        } else {
          setError(data.message || 'Error al enviar la valoración');
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error de conexión. Intentalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-purple-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Valorá tu experiencia</h1>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4 max-w-lg">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              ¡Valoración enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Gracias por valorar tu experiencia en <strong>{restauranteNombre}</strong>.
            </p>
            <Link
              href="/cliente/visitas"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors font-medium"
            >
              Volver a mis visitas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{restauranteNombre}</h2>
      <p className="text-gray-500 text-sm mb-6">Valorá tu experiencia en este restaurante</p>

      {/* Puntuación */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cómo calificás tu experiencia?
        </label>
        <StarRating value={puntuacion} onChange={setPuntuacion} size="lg" />
        {puntuacion > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {puntuacion} de 5 estrellas
          </p>
        )}
      </div>

      {/* Comentario */}
      <div className="mb-6">
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
          Comentá tu experiencia (opcional)
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          placeholder="Contanos qué tal estuvo..."
        />
        <p className="text-sm text-gray-400 mt-1 text-right">{comentario.length}/500</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={puntuacion === 0 || submitting}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {submitting ? 'Enviando valoración...' : 'Enviá tu valoración'}
      </button>
    </form>
  );
}
