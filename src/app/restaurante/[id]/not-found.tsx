// Not Found - Restaurante no encontrado
// Se muestra cuando se accede a un ID de restaurante que no existe en la base de datos.

import Link from 'next/link';

export default function RestauranteNotFound() {
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

      <main className="container mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Restaurante no encontrado
        </h1>
        <p className="text-gray-600 mb-8">
          El restaurante que estás buscando no existe o fue eliminado.
        </p>
        <Link
          href="/restaurantes"
          className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Volvé al listado de restaurantes
        </Link>
      </main>
    </div>
  );
}
