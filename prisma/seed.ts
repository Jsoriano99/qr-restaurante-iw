// Seed script - Datos de prueba para desarrollo
// Uso: npx ts-node prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seed...');

  // Configuración de hashing
  const SALT_ROUNDS = 12;

  // ============================================
  // ADMINISTRADOR
  // ============================================
  console.log('\n📋 Creando administrador...');
  const adminPassword = await bcrypt.hash('Admin123!', SALT_ROUNDS);

  await prisma.administrador.upsert({
    where: { email: 'admin@qr.com' },
    update: {},
    create: {
      id: 'adm-001',
      email: 'admin@qr.com',
      password: adminPassword,
      nombre: 'Admin Sistema',
      role: 'ADMIN',
    },
  });
  console.log('   ✅ Admin creado: admin@qr.com');

  // ============================================
  // RESTAURANTES
  // ============================================
  console.log('\n🍽️ Creando restaurantes...');

  const restPassword = await bcrypt.hash('Restaurante123!', SALT_ROUNDS);

  await prisma.restaurante.upsert({
    where: { email: 'restaurante1@qr.com' },
    update: {
      tipoCocina: 'Española',
      capacidadMaxima: 50,
      horarioApertura: '10:00',
      horarioCierre: '23:00',
      latitud: 40.416775,
      longitud: -3.703790,
    },
    create: {
      id: 'rst-001',
      email: 'restaurante1@qr.com',
      password: restPassword,
      nombre: 'El Buen Gusto',
      direccion: 'C/ Mayor 1, Madrid',
      telefono: '912345678',
      horarios: '10:00-23:00',
      tipoCocina: 'Española',
      capacidadMaxima: 50,
      horarioApertura: '10:00',
      horarioCierre: '23:00',
      latitud: 40.416775,
      longitud: -3.703790,
      qrCode: `QR-RST-001-${Date.now()}`,
      role: 'RESTAURANTE',
    },
  });
  console.log('   ✅ Restaurante 1: El Buen Gusto (restaurante1@qr.com)');

  await prisma.restaurante.upsert({
    where: { email: 'restaurante2@qr.com' },
    update: {
      tipoCocina: 'Mediterránea',
      capacidadMaxima: 80,
      horarioApertura: '12:00',
      horarioCierre: '00:00',
      latitud: 41.385063,
      longitud: 2.173404,
    },
    create: {
      id: 'rst-002',
      email: 'restaurante2@qr.com',
      password: restPassword,
      nombre: 'La Terraza',
      direccion: 'Av. Libertador 42, Barcelona',
      telefono: '934567890',
      horarios: '12:00-00:00',
      tipoCocina: 'Mediterránea',
      capacidadMaxima: 80,
      horarioApertura: '12:00',
      horarioCierre: '00:00',
      latitud: 41.385063,
      longitud: 2.173404,
      qrCode: `QR-RST-002-${Date.now()}`,
      role: 'RESTAURANTE',
    },
  });
  console.log('   ✅ Restaurante 2: La Terraza (restaurante2@qr.com)');

  // ============================================
  // CLIENTES
  // ============================================
  console.log('\n👤 Creando clientes...');

  const clientPassword = await bcrypt.hash('Cliente123!', SALT_ROUNDS);

  await prisma.cliente.upsert({
    where: { email: 'cliente1@qr.com' },
    update: {},
    create: {
      id: 'cli-001',
      email: 'cliente1@qr.com',
      password: clientPassword,
      nombre: 'Juan Pérez',
      telefono: '600123456',
      role: 'CLIENTE',
    },
  });
  console.log('   ✅ Cliente 1: Juan Pérez (cliente1@qr.com)');

  await prisma.cliente.upsert({
    where: { email: 'cliente2@qr.com' },
    update: {},
    create: {
      id: 'cli-002',
      email: 'cliente2@qr.com',
      password: clientPassword,
      nombre: 'María López',
      telefono: '600789012',
      role: 'CLIENTE',
    },
  });
  console.log('   ✅ Cliente 2: María López (cliente2@qr.com)');

  // ============================================
  // CÓDIGOS QR
  // ============================================
  console.log('\n📱 Creando códigos QR...');

  const qr1 = await prisma.codigoQR.create({
    data: {
      uuid: 'QR-001-A',
      idMesa: 'Mesa 1',
      activo: true,
      restauranteId: 'rst-001',
    },
  });
  console.log(`   ✅ QR: ${qr1.uuid} (${qr1.idMesa} - El Buen Gusto)`);

  const qr2 = await prisma.codigoQR.create({
    data: {
      uuid: 'QR-001-B',
      idMesa: 'Mesa 2',
      activo: true,
      restauranteId: 'rst-001',
    },
  });
  console.log(`   ✅ QR: ${qr2.uuid} (${qr2.idMesa} - El Buen Gusto)`);

  const qr3 = await prisma.codigoQR.create({
    data: {
      uuid: 'QR-002-A',
      idMesa: 'Terraza 1',
      activo: true,
      restauranteId: 'rst-002',
    },
  });
  console.log(`   ✅ QR: ${qr3.uuid} (${qr3.idMesa} - La Terraza)`);

  // ============================================
  // VISITAS
  // ============================================
  console.log('\n🚪 Creando visitas...');

  // Visita activa (cliente1 en restaurante1)
  await prisma.visita.create({
    data: {
      id: 'vis-001',
      timestampEntrada: new Date(),
      estado: 'activa',
      acompanantes: 2,
      restauranteId: 'rst-001',
      clienteId: 'cli-001',
      codigoQRId: 'QR-001-A',
    },
  });
  console.log('   ✅ Visita activa: Juan Pérez → El Buen Gusto (Mesa 1, 2 acompañantes)');

  // Visita completada (cliente2 en restaurante1)
  const entradaAyer = new Date();
  entradaAyer.setDate(entradaAyer.getDate() - 1);
  entradaAyer.setHours(20, 0, 0, 0);

  const salidaAyer = new Date(entradaAyer);
  salidaAyer.setHours(22, 30, 0, 0);

  await prisma.visita.create({
    data: {
      id: 'vis-002',
      timestampEntrada: entradaAyer,
      timestampSalida: salidaAyer,
      duracionMinutos: 150,
      estado: 'completada',
      acompanantes: 1,
      restauranteId: 'rst-001',
      clienteId: 'cli-002',
      codigoQRId: 'QR-001-B',
    },
  });
  console.log('   ✅ Visita completada: María López → El Buen Gusto (Mesa 2, 150min)');

  // Visita completada (cliente1 en restaurante2)
  const entradaAnteayer = new Date();
  entradaAnteayer.setDate(entradaAnteayer.getDate() - 2);
  entradaAnteayer.setHours(13, 0, 0, 0);

  const salidaAnteayer = new Date(entradaAnteayer);
  salidaAnteayer.setHours(14, 15, 0, 0);

  await prisma.visita.create({
    data: {
      id: 'vis-003',
      timestampEntrada: entradaAnteayer,
      timestampSalida: salidaAnteayer,
      duracionMinutos: 75,
      estado: 'completada',
      acompanantes: 0,
      restauranteId: 'rst-002',
      clienteId: 'cli-001',
      codigoQRId: 'QR-002-A',
    },
  });
  console.log('   ✅ Visita completada: Juan Pérez → La Terraza (Terraza 1, 75min)');

  // ============================================
  // VALORACIONES
  // ============================================
  console.log('\n⭐ Creando valoraciones...');

  await prisma.valoracion.create({
    data: {
      id: 'val-001',
      puntuacion: 5,
      comentario: 'Excelente atención, la comida deliciosa. Volveremos sin duda.',
      timestamp: salidaAyer,
      restauranteId: 'rst-001',
      clienteId: 'cli-002',
    },
  });
  console.log('   ✅ Valoración: María López → El Buen Gusto (5★)');

  await prisma.valoracion.create({
    data: {
      id: 'val-002',
      puntuacion: 4,
      comentario: 'Muy buena terraza, el servicio fue rápido. Volveré.',
      timestamp: salidaAnteayer,
      restauranteId: 'rst-002',
      clienteId: 'cli-001',
    },
  });
  console.log('   ✅ Valoración: Juan Pérez → La Terraza (4★)');

  // ============================================
  // RESUMEN
  // ============================================
  console.log('\n📊 Resumen del seed:');
  console.log('   ┌──────────────────────┬────────────────────────┬────────────────┐');
  console.log('   │ Tipo                 │ Email                   │ Password        │');
  console.log('   ├──────────────────────┼────────────────────────┼────────────────┤');
  console.log('   │ ADMIN                │ admin@qr.com           │ Admin123!      │');
  console.log('   │ RESTAURANTE          │ restaurante1@qr.com    │ Restaurante123!│');
  console.log('   │ RESTAURANTE          │ restaurante2@qr.com    │ Restaurante123!│');
  console.log('   │ CLIENTE              │ cliente1@qr.com        │ Cliente123!    │');
  console.log('   │ CLIENTE              │ cliente2@qr.com        │ Cliente123!    │');
  console.log('   └──────────────────────┴────────────────────────┴────────────────┘');
  console.log('\n✨ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('\n❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
