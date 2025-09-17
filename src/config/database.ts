import { PrismaClient } from '@prisma/client';

// Prisma client instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting from database');
  await prisma.$disconnect();
}); 