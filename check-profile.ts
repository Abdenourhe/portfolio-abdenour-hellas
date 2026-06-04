import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const profile = await prisma.profile.findFirst();
  console.log('Profile photoUrl:', profile?.photoUrl);
  console.log('Profile cvUrl:', profile?.cvUrl);
  await prisma.$disconnect();
}
main().catch((e: any) => { console.error(e); process.exit(1); });
