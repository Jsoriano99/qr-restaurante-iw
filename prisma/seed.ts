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

  const admin = await prisma.administrador.upsert({
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
  console.log(`   ✅ Admin creado: ${admin.email}`);

  // ============================================
  // RESTAURANTES
  // ============================================
  console.log('\n🍽️ Creando restaurantes...');

  const restPassword = await bcrypt.hash('Restaurante123!', SALT_ROUNDS);

  const restaurante1 = await prisma.restaurante.upsert({
    where: { email: 'restaurante1@qr.com' },
    update: {},
    create: {
      id: 'rst-001',
      email: 'restaurante1@qr.com',
      password: restPassword,
      nombre: 'El Buen Gusto',
      direccion: 'C/ Mayor 1, Madrid',
      telefono: '912345678',
      horarios: '10:00-23:00',
      qrCode: `QR-RST-001-${Date.now()}`,
      role: 'RESTAURANTE',
    },
  });
  console.log(`   ✅ Restaurante 1: ${restaurante1.nombre} (${restaurante1.email})`);
  console.log(`   📱 QR Code: ${restaurante1.qrCode}`);

  const restaurante2 = await prisma.restaurante.upsert({
    where: { email: 'restaurante2@qr.com' },
    update: {},
    create: {
      id: 'rst-002',
      email: 'restaurante2@qr.com',
      password: restPassword,
      nombre: 'La Terraza',
      direccion: 'Av. Libertador 42, Barcelona',
      telefono: '934567890',
      horarios: '12:00-00:00',
      qrCode: `QR-RST-002-${Date.now()}`,
      role: 'RESTAURANTE',
    },
  });
  console.log(`   ✅ Restaurante 2: ${restaurante2.nombre} (${restaurante2.email})`);
  console.log(`   📱 QR Code: ${restaurante2.qrCode}`);

  // ============================================
  // CLIENTES
  // ============================================
  console.log('\n👤 Creando clientes...');

  const clientPassword = await bcrypt.hash('Cliente123!', SALT_ROUNDS);

  const cliente1 = await prisma.cliente.upsert({
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
  console.log(`   ✅ Cliente 1: ${cliente1.nombre} (${cliente1.email})`);

  const cliente2 = await prisma.cliente.upsert({
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
  console.log(`   ✅ Cliente 2: ${cliente2.nombre} (${cliente2.email})`);

  // ============================================
  // RESUMEN
  // ============================================
  console.log('\n📊 Resumen del seed:');
  console.log('   ┌─────────────────┬────────────────────────┬────────────┐');
  console.log('   │ Tipo            │ Email                   │ Password   │');
  console.log('   ├─────────────────┼────────────────────────┼────────────┤');
  console.log('   │ ADMIN           │ admin@qr.com           │ Admin123!  │');
  console.log('   │ RESTAURANTE     │ restaurante1@qr.com    │ Restaurante123! │');
  console.log('   │ RESTAURANTE     │ restaurante2@qr.com    │ Restaurante123! │');
  console.log('   │ CLIENTE         │ cliente1@qr.com        │ Cliente123! │');
  console.log('   │ CLIENTE         │ cliente2@qr.com        │ Cliente123! │');
  console.log('   └─────────────────┴────────────────────────┴────────────┘');
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