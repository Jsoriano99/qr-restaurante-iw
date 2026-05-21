// Restaurantes Page - Listado público de restaurantes disponibles
// Esta página muestra un listado de todos los restaurantes disponibles en QR Restaurante, con información básica como nombre, dirección, teléfono y horarios. Los usuarios pueden hacer clic en cada restaurante para ver su menú. Esta página es pública y no requiere autenticación.

import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Metadata para la página de restaurantes, con título y descripción optimizados para SEO
export const metadata: Metadata = {
  title: 'Restaurantes - QR Restaurante',
  description: 'Explorá todos los restaurantes disponibles en QR Restaurante',
};

// Interfaz para las propiedades del componente RestauranteCard
interface RestauranteCardProps {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horarios: string | null;
}

// Componente para mostrar la información básica de un restaurante en una tarjeta
function RestauranteCard({ id, nombre, direccion, telefono, horarios }: RestauranteCardProps) {
  return (
    <article
      className="bg-white p-6 rounded-lg shadow"
      aria-label={nombre}
    >
      <h2 className="text-lg font-bold mb-3">{nombre}</h2>

      <div className="space-y-2 text-gray-600">
        <p className="flex items-start gap-2">
          <span aria-hidden="true">📍</span>
          <span>{direccion}</span>
        </p>
        <p className="flex items-center gap-2">
          <span aria-hidden="true">📞</span>
          <a
            href={`tel:${telefono}`}
            className="hover:text-orange-600 transition-colors"
          >
            {telefono}
          </a>
        </p>
        {horarios && (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <span aria-hidden="true">🕐</span>
            <span>{horarios}</span>
          </p>
        )}
      </div>

      <Link
        href={`/restaurante/${id}/menu`}
        className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors text-sm font-medium"
        aria-label={`Ver menú de ${nombre}`}
      >
        Ver Menú
      </Link>
    </article>
  );
}

export default async function RestaurantesPage() {
  let restaurantes: RestauranteCardProps[] = [];
  let error = false;

  try {
    const data = await prisma.restaurante.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        telefono: true,
        horarios: true,
      },
      orderBy: { nombre: 'asc' },
    });

    restaurantes = data.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      direccion: r.direccion,
      telefono: r.telefono,
      horarios: r.horarios,
    }));
  } catch (e) {
    console.error('Error al cargar restaurantes:', e);
    error = true;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:underline">
            QR Restaurante
          </Link>
          <nav className="space-x-4">
            <Link href="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="hover:underline">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Restaurantes Disponibles
        </h1>
        <p className="text-gray-600 mb-8">
          Explorá todos los restaurantes y descubrí sus menús
        </p>

        {error ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Error al cargar restaurantes
            </h2>
            <p className="text-gray-600">
              No pudimos cargar la información. Por favor, intentá de nuevo más tarde.
            </p>
          </div>
        ) : restaurantes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4" aria-hidden="true">🏪</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No hay restaurantes disponibles
            </h2>
            <p className="text-gray-600">
              Pronto se agregarán nuevos restaurantes. ¡Volve a consultar más tarde!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantes.map((restaurante) => (
              <RestauranteCard
                key={restaurante.id}
                id={restaurante.id}
                nombre={restaurante.nombre}
                direccion={restaurante.direccion}
                telefono={restaurante.telefono}
                horarios={restaurante.horarios}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
