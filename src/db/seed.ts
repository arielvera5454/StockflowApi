import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida');
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin1234', 10);
  const operatorPassword = await bcrypt.hash('Oper1234', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@stockflow.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const operator = await prisma.user.create({
    data: {
      email: 'operator@stockflow.com',
      password: operatorPassword,
      role: 'OPERATOR',
    },
  });

  console.log(`Usuarios creados: ${admin.email}, ${operator.email}`);

  const electronica = await prisma.category.create({ data: { name: 'Electrónica' } });
  const hogar = await prisma.category.create({ data: { name: 'Hogar' } });
  const oficina = await prisma.category.create({ data: { name: 'Oficina' } });

  await prisma.product.createMany({
    data: [
      { name: 'Laptop HP', sku: 'LAP001', stock: 15, minStock: 5, price: 899.99, categoryId: electronica.id },
      { name: 'Monitor Dell 24"', sku: 'MON002', stock: 8, minStock: 3, price: 249.99, categoryId: electronica.id },
      { name: 'Teclado mecánico', sku: 'TEC003', stock: 3, minStock: 5, price: 79.99, categoryId: electronica.id },
      { name: 'Silla ergonómica', sku: 'SILL004', stock: 12, minStock: 2, price: 399.99, categoryId: oficina.id },
      { name: 'Lámpara LED escritorio', sku: 'LAM005', stock: 20, minStock: 10, price: 49.99, categoryId: hogar.id },
    ],
  });

  console.log('Seed completado exitosamente.');
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });