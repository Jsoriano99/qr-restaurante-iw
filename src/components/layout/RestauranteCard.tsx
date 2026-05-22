// RestauranteCard - Tarjeta reutilizable para listado de restaurantes
// Componente server-side que muestra información básica con enlace a detalle

import Link from 'next/link';

export interface RestauranteCardProps {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horarios: string | null;
}

export default function RestauranteCard({
  id,
  nombre,
  direccion,
  telefono,
  horarios,
}: RestauranteCardProps) {
  return (
    <article
      className="bg-white p-6 rounded-lg shadow"
      aria-label={nombre}
    >
      <h2 className="text-lg font-bold mb-3 text-gray-800">{nombre}</h2>

      <div className="space-y-2 text-gray-600">
        <p>{direccion}</p>
        <p>
          <a
            href={`tel:${telefono}`}
            className="hover:text-orange-600 transition-colors"
            aria-label={`Llamar al ${telefono}`}
          >
            {telefono}
          </a>
        </p>
        {horarios && (
          <p className="text-sm text-gray-500">{horarios}</p>
        )}
      </div>

      <Link
        href={`/restaurante/${id}`}
        className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors text-sm font-medium"
        aria-label={`Ver detalles de ${nombre}`}
      >
        Ver Más
      </Link>
    </article>
  );
}
