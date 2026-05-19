// Home Page - QR Restaurante

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">QR Restaurante</h1>
          <nav className="space-x-4">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Bienvenido a QR Restaurante
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          La forma más fácil de gestionar tu restaurante y pedidos
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">🐡 Para Clientes</h3>
            <p className="text-gray-600">
              Escanea el QR de tu mesa y explora el menú desde tu teléfono
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">🏪 Para Restaurantes</h3>
            <p className="text-gray-600">
              Gestiona tu menú, pedidos y clientes de forma eficiente
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">⚙️ Administración</h3>
            <p className="text-gray-600">
              Control total sobre usuarios y configuración del sistema
            </p>
          </div>
        </div>

        <div className="mt-12 space-x-4">
          <Link 
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            ¡Regístrate Ahora!
          </Link>
          <Link 
            href="/login"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    </div>
  );
}