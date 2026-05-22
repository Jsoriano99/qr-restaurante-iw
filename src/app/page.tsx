// Home Page - QR Restaurante
// Server Component que obtiene los restaurantes destacados y los pasa al cliente para filtrado interactivo

import Link from 'next/link';
import prisma from '@/lib/prisma';
import PublicHeader from '@/components/layout/PublicHeader';
import HomeContent from '@/components/home/HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let restaurantes: {
    id: string;
    nombre: string;
    direccion: string;
    tipoCocina: string;
    horarios: string | null;
  }[] = [];

  try {
    const data = await prisma.restaurante.findMany({
      take: 6,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        tipoCocina: true,
        horarios: true,
      },
    });

    restaurantes = data;
  } catch (e) {
    console.error('Error al cargar restaurantes destacados:', e);
  }

  // Extraer tipos de cocina únicos y no vacíos
  const tiposCocina = [
    ...new Set(restaurantes.map((r) => r.tipoCocina).filter(Boolean)),
  ] as string[];

  return (
    <div className="min-h-screen bg-gray-100">
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a QR Restaurante
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Escaneá, entrá y disfrutá. La forma más fácil de gestionar tu
              visita.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Registrate Gratis
              </Link>
              <Link
                href="/restaurantes"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-orange-500 transition-colors"
              >
                Explorá Restaurantes
              </Link>
            </div>
          </div>
        </section>

        {/* Destacados Section */}
        <HomeContent
          restaurantes={restaurantes}
          tiposCocina={tiposCocina}
        />
      </main>
    </div>
  );
}
