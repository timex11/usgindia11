import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Enterprise RBAC...');

  const permissionsList = [
    // Exams
    { slug: 'exams.read', name: 'Read Exams', module: 'EXAMS' },
    { slug: 'exams.create', name: 'Create Exams', module: 'EXAMS' },
    { slug: 'exams.update', name: 'Update Exams', module: 'EXAMS' },
    { slug: 'exams.delete', name: 'Delete Exams', module: 'EXAMS' },
    { slug: 'exams.attempt', name: 'Attempt Exams', module: 'EXAMS' },
    
    // Scholarships
    { slug: 'scholarships.read', name: 'Read Scholarships', module: 'SCHOLARSHIPS' },
    { slug: 'scholarships.apply', name: 'Apply Scholarships', module: 'SCHOLARSHIPS' },
    { slug: 'scholarships.manage', name: 'Manage Scholarships', module: 'SCHOLARSHIPS' },

    // Jobs
    { slug: 'jobs.read', name: 'Read Jobs', module: 'JOBS' },
    { slug: 'jobs.apply', name: 'Apply Jobs', module: 'JOBS' },
    { slug: 'jobs.manage', name: 'Manage Jobs', module: 'JOBS' },

    // AI
    { slug: 'ai.chat', name: 'Chat with AI', module: 'AI' },
    { slug: 'ai.analyze', name: 'AI Analysis', module: 'AI' },

    // Users & System
    { slug: 'users.manage', name: 'Manage Users', module: 'SYSTEM' },
    { slug: 'settings.manage', name: 'Manage System Settings', module: 'SYSTEM' },
    { slug: 'audit.read', name: 'Read Audit Logs', module: 'SYSTEM' },
  ];

  // 1. Seed Permissions
  const permissions = await Promise.all(
    permissionsList.map((p: any) => 
      prisma.permission.upsert({
        where: { slug: p.slug },
        update: p,
        create: p,
      })
    )
  );
  console.log(`✅ Seeded ${permissions.length} permissions`);

  // 2. Seed Roles
  const roles = [
    { slug: 'platform_admin', name: 'Platform Administrator' },
    { slug: 'student', name: 'Student' },
    { slug: 'faculty', name: 'Faculty' },
    { slug: 'institution_admin', name: 'Institution Administrator' },
  ];

  const seededRoles = await Promise.all(
    roles.map((r: any) => 
      prisma.role.upsert({
        where: { slug: r.slug },
        update: r,
        create: r,
      })
    )
  );
  console.log(`✅ Seeded ${seededRoles.length} roles`);

  // 3. Map Permissions to Roles
  const adminRole = await prisma.role.findUnique({ where: { slug: 'platform_admin' } });
  const studentRole = await prisma.role.findUnique({ where: { slug: 'student' } });

  if (adminRole) {
    // Admin gets all permissions
    await Promise.all(
      permissions.map((p: any) => 
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
          update: {},
          create: { roleId: adminRole.id, permissionId: p.id },
        })
      )
    );
  }

  if (studentRole) {
    // Student gets limited permissions
    const studentPerms = permissions.filter((p: any) => 
      ['exams.read', 'exams.attempt', 'scholarships.read', 'scholarships.apply', 'jobs.read', 'jobs.apply', 'ai.chat'].includes(p.slug)
    );
    await Promise.all(
      studentPerms.map((p: any) => 
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: studentRole.id, permissionId: p.id } },
          update: {},
          create: { roleId: studentRole.id, permissionId: p.id },
        })
      )
    );
  }

  console.log('🌟 RBAC Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
