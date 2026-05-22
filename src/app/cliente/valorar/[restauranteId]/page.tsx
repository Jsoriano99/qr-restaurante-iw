// Page: V-08 Valorar Restaurante - Formulario de valoración
// Permite al cliente puntuar y comentar su experiencia en un restaurante

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ValorarForm from '@/components/cliente/ValorarForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ restauranteId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { restauranteId } = await params;

  const restaurante = await prisma.restaurante.findUnique({
    where: { id: restauranteId },
    select: { nombre: true },
  });

  if (!restaurante) {
    return { title: 'Restaurante no encontrado' };
  }

  return {
    title: `Valorá ${restaurante.nombre} - QR Restaurante`,
  };
}

export default async function ValorarPage({ params }: Props) {
  const { restauranteId } = await params;

  const restaurante = await prisma.restaurante.findUnique({
    where: { id: restauranteId },
    select: { nombre: true },
  });

  if (!restaurante) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Valorá tu experiencia</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 max-w-lg">
        <ValorarForm
          restauranteId={restauranteId}
          restauranteNombre={restaurante.nombre}
        />
      </main>
    </div>
  );
}
