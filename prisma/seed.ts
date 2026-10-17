import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gcoin.com';
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    await prisma.user.create({
      data: {
        username: 'admin',
        email: adminEmail,
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
  }

  const sample = await prisma.user.findUnique({ where: { email: 'demo@gcoin.com' } });
  if (!sample) {
    await prisma.user.create({
      data: {
        username: 'demo_dev',
        email: 'demo@gcoin.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        role: 'USER',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
