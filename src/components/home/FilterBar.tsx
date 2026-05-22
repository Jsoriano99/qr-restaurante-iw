'use client';

// FilterBar - Filtro de tipo de cocina para la home
// Componente cliente que maneja la selección de categorías vía estado local

interface FilterBarProps {
  tiposCocina: string[];
  selectedTipo: string | null;
  onFilterChange: (tipo: string | null) => void;
}

export default function FilterBar({
  tiposCocina,
  selectedTipo,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2 mb-8"
      role="group"
      aria-label="Filtrar por tipo de cocina"
    >
      <button
        onClick={() => onFilterChange(null)}
        aria-pressed={selectedTipo === null}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedTipo === null
            ? 'bg-orange-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Todas
      </button>

      {tiposCocina.map((tipo) => (
        <button
          key={tipo}
          onClick={() => onFilterChange(tipo)}
          aria-pressed={selectedTipo === tipo}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTipo === tipo
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tipo}
        </button>
      ))}
    </div>
  );
}
