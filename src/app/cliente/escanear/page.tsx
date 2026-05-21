// Page: Escaneo QR - Registrar entrada
// Recibe uuid y firma desde la URL, valida el QR y permite registrar la entrada

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface User { id: string; email: string; nombre: string; role: string; }

type QRState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'valid'; restaurante: { id: string; nombre: string }; idMesa: string };

function EscanearContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  const firma = searchParams.get('firma');

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [qrState, setQrState] = useState<QRState>({ status: 'loading' });
  const [acompanantes, setAcompañantes] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showAforoModal, setShowAforoModal] = useState(false);
  const [aforoMessage, setAforoMessage] = useState('');

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
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Validar QR en paralelo con auth check
  useEffect(() => {
    if (!uuid || !firma) {
      setQrState({
        status: 'error',
        message: 'Faltan parámetros del código QR (uuid y firma)',
      });
      return;
    }

    const validarQR = async () => {
      setQrState({ status: 'loading' });
      try {
        const res = await fetch(
          `/api/codigos-qr/${encodeURIComponent(uuid)}/validar?firma=${encodeURIComponent(firma)}`
        );
        const data = await res.json();

        if (!data.success || !data.data?.valido) {
          const motivo = data.data?.motivo || 'desconocido';
          const mensajes: Record<string, string> = {
            no_encontrado: 'El código QR no existe en el sistema',
            inactivo: 'El código QR ya no está activo',
            expirado: 'El código QR ha expirado',
            firma_invalida: 'La firma del código QR no es válida',
          };
          setQrState({
            status: 'error',
            message: mensajes[motivo] || 'Error desconocido al validar el QR',
          });
          return;
        }

        setQrState({
          status: 'valid',
          restaurante: data.data.restaurante,
          idMesa: data.data.idMesa,
        });
      } catch {
        setQrState({
          status: 'error',
          message: 'Error de conexión al validar el QR',
        });
      }
    };

    validarQR();
  }, [uuid, firma]);

  // Silently wait for auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/cliente/visitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoQRUuid: uuid,
          firma,
          acompanantes,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        router.push('/cliente/visitas');
        return;
      }

      if (res.status === 409) {
        setAforoMessage(data.message || 'Aforo completo');
        setShowAforoModal(true);
        return;
      }

      setSubmitError(data.message || 'Error al registrar la entrada');
    } catch {
      setSubmitError('Error de conexión al registrar la entrada');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Escaneá tu QR</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user?.nombre}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 max-w-md">
        {/* Validando QR */}
        {qrState.status === 'loading' && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4 animate-pulse">📷</div>
            <p className="text-gray-600 text-lg">Validando QR...</p>
          </div>
        )}

        {/* Error de QR */}
        {qrState.status === 'error' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {qrState.message}
            </div>
            <button
              onClick={() => router.push('/cliente')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        )}

        {/* QR Válido — formulario de registro */}
        {qrState.status === 'valid' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold text-center text-green-600 mb-4">
                ✅ QR Válido
              </h2>

              <div className="border-t pt-4 mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Restaurante:</span>{' '}
                  {qrState.restaurante.nombre}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Mesa:</span> {qrState.idMesa}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Acompañantes
                </label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setAcompañantes(Math.max(0, acompanantes - 1))}
                    disabled={acompanantes <= 0}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Quitar acompañante"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold w-10 text-center">
                    {acompanantes}
                  </span>
                  <button
                    onClick={() => setAcompañantes(Math.min(10, acompanantes + 1))}
                    disabled={acompanantes >= 10}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Agregar acompañante"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Máximo 10 acompañantes
                </p>
              </div>

              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {submitError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg"
              >
                {submitting ? 'Registrando entrada...' : 'Registrar Entrada'}
              </button>
            </div>
          </>
        )}

        {/* Aforo Modal */}
        {showAforoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
              <div className="text-center mb-4">
                <span className="text-4xl">🚫</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-600 text-center">
                Restaurante lleno
              </h3>
              <p className="text-gray-700 mb-6 text-center">
                {aforoMessage}
              </p>
              <button
                onClick={() => {
                  setShowAforoModal(false);
                  router.push('/cliente');
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EscanearPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      }
    >
      <EscanearContent />
    </Suspense>
  );
}
