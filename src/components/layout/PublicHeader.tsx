// PublicHeader - Encabezado compartido para páginas públicas
// Componente server-side que provee navegación consistente con logo y enlaces

import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="bg-orange-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold hover:underline"
          aria-label="QR Restaurante - Ir al inicio"
        >
          QR Restaurante
        </Link>
        <nav className="space-x-4" aria-label="Navegación principal">
          <Link
            href="/login"
            className="hover:underline"
            aria-label="Iniciar sesión"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="hover:underline"
            aria-label="Registrarse"
          >
            Registrate
          </Link>
        </nav>
      </div>
    </header>
  );
}
