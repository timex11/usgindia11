const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const constraints = [
      'profiles_auth_id_key',
      'profiles_id_fkey',
      'profiles_username_key',
      'profiles_email_key',
      'profiles_phone_key',
      'profiles_pkey',
    ];
    for (const constraint of constraints) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE profiles DROP CONSTRAINT IF EXISTS ${constraint} CASCADE;`);
        console.log(`Dropped ${constraint}`);
      } catch (err) {
        // Ignore if constraint doesn't exist
      }
    }
    console.log('Finished dropping constraints.');
  } finally {
    await prisma.$disconnect();
  }
}
main();
