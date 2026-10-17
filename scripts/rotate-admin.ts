import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const newPassword = process.env.NEW_ADMIN_PASSWORD || process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: ADMIN_EMAIL="admin@gcoin.com" NEW_ADMIN_PASSWORD="newpass" npx ts-node scripts/rotate-admin.ts');
    console.error('Or: npx ts-node scripts/rotate-admin.ts admin@gcoin.com newpass');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('No user found with email:', email);
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { passwordHash: hash } });

  console.log(`Updated password for ${email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
