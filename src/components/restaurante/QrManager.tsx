'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CodigoQRPublico } from '@/types/codigoqr';

interface CodigoConImagen extends CodigoQRPublico {
  imagenSvg?: string;
}

export default function QrManager() {
  // ── Form state ──
  const [idMesa, setIdMesa] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');

  // ── Table state ──
  const [codigos, setCodigos] = useState<CodigoConImagen[]>([]);
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState('');

  // ── Feedback state ──
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Preview modal state ──
  const [preview, setPreview] = useState<CodigoConImagen | null>(null);

  // ── Auto-clear feedback ──
  useEffect(() => {
    if (!error && !success) return;
    const t = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
    return () => clearTimeout(t);
  }, [error, success]);

  // ── Fetch QR codes ──
  const fetchCodigos = useCallback(async () => {
    try {
      setTableError('');
      setLoading(true);
      const res = await fetch('/api/restaurante/codigos-qr');
      const data = await res.json();
      if (data.success) {
        setCodigos(data.data.codigos);
      } else {
        setTableError(data.message || 'Error al cargar los códigos QR');
      }
    } catch {
      setTableError('Error de conexión al cargar los códigos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodigos();
  }, [fetchCodigos]);

  // ── Generate QR ──
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGenerating(true);

    try {
      const body: Record<string, string> = { idMesa: idMesa.trim() };
      if (fechaExpiracion) {
        body.fechaExpiracion = new Date(
          fechaExpiracion + 'T12:00:00'
        ).toISOString();
      }

      const res = await fetch('/api/restaurante/codigos-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setSuccess(`Código QR generado para ${data.data.codigo.idMesa}`);

      // Store SVG so we can show it & allow download
      if (data.data.imagenSvg) {
        setSvgs((prev) => ({
          ...prev,
          [data.data.codigo.uuid]: data.data.imagenSvg,
        }));
      }

      setIdMesa('');
      setFechaExpiracion('');
      await fetchCodigos();
    } catch {
      setError('Error de conexión al generar el código QR');
    } finally {
      setGenerating(false);
    }
  };

  // ── Toggle active / inactive ──
  const handleToggle = async (uuid: string, currentActivo: boolean) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/restaurante/codigos-qr/${uuid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !currentActivo }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      await fetchCodigos();
    } catch {
      setError('Error de conexión al actualizar el código QR');
    }
  };

  // ── Download SVG ──
  const handleDownload = (codigo: CodigoConImagen) => {
    const svg = svgs[codigo.uuid];
    if (!svg) {
      setError(
        'No hay una vista previa disponible para descargar. Generá el QR de nuevo.'
      );
      return;
    }

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${codigo.idMesa.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Helpers ──
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sin expiración';
    return new Date(dateStr).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateUuid = (uuid: string) => uuid.slice(0, 8) + '…';

  // ── Render ──
  return (
    <div className="space-y-8">
      {/* ─── Feedback messages ─── */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* ─── Section 1: Generate QR Form ─── */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Generá un código QR</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Generá un código QR para cada mesa. El código se asociá automáticamente
          a tu restaurante.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label
              htmlFor="idMesa"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Identificador de la mesa
            </label>
            <input
              id="idMesa"
              type="text"
              value={idMesa}
              onChange={(e) => setIdMesa(e.target.value)}
              placeholder="ej: Mesa 1"
              maxLength={50}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="fechaExpiracion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fecha de expiración{' '}
              <span className="font-normal text-gray-500">(opcional)</span>
            </label>
            <input
              id="fechaExpiracion"
              type="date"
              value={fechaExpiracion}
              onChange={(e) => setFechaExpiracion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Generando…' : 'Generar QR'}
          </button>
        </form>
      </section>

      {/* ─── Section 2: QR Codes Table ─── */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Códigos QR generados</h3>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-500">Cargando…</div>
          </div>
        )}

        {tableError && !loading && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{tableError}</p>
            <button
              onClick={fetchCodigos}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !tableError && codigos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">Todavía no generaste ningún código QR</p>
            <p className="text-sm">
              Usá el formulario de arriba para generar el primer código.
            </p>
          </div>
        )}

        {!loading && !tableError && codigos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 font-semibold text-gray-700">Mesa</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">UUID</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Estado</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Creado</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Expira</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">QR</th>
                  <th className="py-2 px-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {codigos.map((codigo) => (
                  <tr
                    key={codigo.uuid}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 font-medium">
                      {codigo.idMesa}
                    </td>
                    <td className="py-2 px-3 font-mono text-gray-500 text-xs">
                      {truncateUuid(codigo.uuid)}
                    </td>
                    <td className="py-2 px-3">
                      {codigo.activo ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-600 text-xs">
                      {formatDate(codigo.fechaCreacion)}
                    </td>
                    <td className="py-2 px-3 text-gray-600 text-xs">
                      {formatDate(codigo.fechaExpiracion)}
                    </td>
                    <td className="py-2 px-3">
                      {svgs[codigo.uuid] ? (
                        <button
                          type="button"
                          onClick={() => setPreview(codigo)}
                          className="inline-block w-10 h-10 border border-gray-200 rounded overflow-hidden hover:ring-2 hover:ring-blue-300 transition-shadow cursor-pointer"
                          title="Ver QR"
                          dangerouslySetInnerHTML={{ __html: svgs[codigo.uuid] }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(codigo.uuid, codigo.activo)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            codigo.activo
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {codigo.activo
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>
                        {svgs[codigo.uuid] && (
                          <button
                            type="button"
                            onClick={() => handleDownload(codigo)}
                            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            Descargar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ─── Section 3: QR Preview Modal ─── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">QR - {preview.idMesa}</h4>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex justify-center mb-4">
              {svgs[preview.uuid] ? (
                <div
                  className="w-48 h-48"
                  dangerouslySetInnerHTML={{ __html: svgs[preview.uuid] }}
                />
              ) : (
                <p className="text-gray-400">Vista previa no disponible</p>
              )}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Mesa:</span> {preview.idMesa}
              </p>
              <p>
                <span className="font-semibold">UUID:</span>{' '}
                <span className="font-mono text-xs">{preview.uuid}</span>
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{' '}
                {preview.activo ? 'Activo' : 'Inactivo'}
              </p>
              <p>
                <span className="font-semibold">Creado:</span>{' '}
                {formatDate(preview.fechaCreacion)}
              </p>
              <p>
                <span className="font-semibold">Expira:</span>{' '}
                {formatDate(preview.fechaExpiracion)}
              </p>
            </div>

            {svgs[preview.uuid] && (
              <button
                type="button"
                onClick={() => handleDownload(preview)}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Descargar SVG
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
