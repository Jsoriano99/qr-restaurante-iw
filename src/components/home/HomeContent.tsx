'use client';

// HomeContent - Contenedor interactivo de la home
// Componente cliente que maneja el filtrado de restaurantes destacados

import { useState } from 'react';
import Link from 'next/link';
import FilterBar from './FilterBar';
import DestacadoCard from '@/components/layout/DestacadoCard';

interface RestauranteData {
  id: string;
  nombre: string;
  direccion: string;
  tipoCocina: string;
  horarios: string | null;
}

interface HomeContentProps {
  restaurantes: RestauranteData[];
  tiposCocina: string[];
}

export default function HomeContent({
  restaurantes,
  tiposCocina,
}: HomeContentProps) {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  const filteredRestaurantes =
    selectedTipo === null
      ? restaurantes
      : restaurantes.filter((r) => r.tipoCocina === selectedTipo);

  const hasRestaurants = restaurantes.length > 0;
  const hasFiltered = filteredRestaurantes.length > 0;

  if (!hasRestaurants) {
    return (
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Restaurantes Destacados
        </h2>
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No hay restaurantes destacados aún
          </h3>
          <p className="text-gray-600 mb-6">
            Pronto se agregarán nuevos restaurantes. ¡Volvé a consultar más tarde!
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Registrate Gratis
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Restaurantes Destacados
          </h2>
          <p className="text-gray-600">Descubrí los mejores lugares</p>
        </div>
        <Link
          href="/restaurantes"
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          Ver Todos &rarr;
        </Link>
      </div>

      <FilterBar
        tiposCocina={tiposCocina}
        selectedTipo={selectedTipo}
        onFilterChange={setSelectedTipo}
      />

      {hasFiltered ? (
        <div
          className={
            filteredRestaurantes.length === 1
              ? 'flex justify-center'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {filteredRestaurantes.map((r) => (
            <DestacadoCard
              key={r.id}
              id={r.id}
              nombre={r.nombre}
              direccion={r.direccion}
              tipoCocina={r.tipoCocina}
              horarios={r.horarios}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No encontramos restaurantes de {selectedTipo}
          </h3>
          <p className="text-gray-600 mb-6">
            Intentá con otro tipo de cocina o mostrá todos los disponibles.
          </p>
          <button
            onClick={() => setSelectedTipo(null)}
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Mostrar Todos
          </button>
        </div>
      )}
    </section>
  );
}
