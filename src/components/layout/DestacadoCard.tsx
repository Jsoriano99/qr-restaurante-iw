// DestacadoCard - Tarjeta para restaurante destacado en la home
// Muestra información principal y enlaza a la página de detalle del restaurante

import Link from 'next/link';

interface DestacadoCardProps {
  id: string;
  nombre: string;
  direccion: string;
  tipoCocina: string;
  horarios: string | null;
}

export default function DestacadoCard({
  id,
  nombre,
  direccion,
  tipoCocina,
  horarios,
}: DestacadoCardProps) {
  return (
    <article
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
      aria-label={`Restaurante destacado: ${nombre}`}
    >
      <Link href={`/restaurante/${id}`} className="block">
        <h2 className="text-lg font-bold mb-2 text-gray-800">{nombre}</h2>

        <p className="text-gray-600 mb-2">{direccion}</p>

        {tipoCocina && (
          <span className="inline-block bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded mb-2">
            {tipoCocina}
          </span>
        )}

        {horarios && (
          <p className="text-sm text-gray-500 mt-2">{horarios}</p>
        )}
      </Link>
    </article>
  );
}
