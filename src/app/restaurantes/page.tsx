// Restaurantes Page - Listado público de restaurantes disponibles
// Esta página muestra un listado de todos los restaurantes disponibles en QR Restaurante, con información básica como nombre, dirección, teléfono y horarios. Los usuarios pueden hacer clic en cada restaurante para ver su detalle. Esta página es pública y no requiere autenticación.

import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import RestauranteCard from '@/components/layout/RestauranteCard';
import type { RestauranteCardProps } from '@/components/layout/RestauranteCard';
import PublicHeader from '@/components/layout/PublicHeader';

export const dynamic = 'force-dynamic';

// Metadata para la página de restaurantes, con título y descripción optimizados para SEO
export const metadata: Metadata = {
  title: 'Restaurantes - QR Restaurante',
  description: 'Explorá todos los restaurantes disponibles en QR Restaurante',
};

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
      <PublicHeader />

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
