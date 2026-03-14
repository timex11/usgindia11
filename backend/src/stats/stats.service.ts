import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemStats() {
    const [users, scholarships, jobs, scholarshipApps, jobApps] =
      await Promise.all([
        this.prisma.profile.count(),
        this.prisma.scholarship.count(),
        this.prisma.job.count(),
        this.prisma.scholarshipApplication.count(),
        this.prisma.jobApplication.count(),
      ]);

    return {
      users,
      scholarships,
      jobs,
      applications: scholarshipApps + jobApps,
    };
  }

  async getDbStats() {
    const tableStats = await this.prisma.$queryRaw<
      Array<{ table_name: string; row_count: number; total_size: string }>
    >`
      SELECT
        relname AS table_name,
        n_live_tup AS row_count,
        pg_size_pretty(pg_total_relation_size(relid)) AS total_size
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC;
    `;

    const dbSize = await this.prisma.$queryRaw<Array<{ size: string }>>`
      SELECT pg_size_pretty(pg_database_size(current_database())) AS size;
    `;

    return {
      tables: tableStats,
      totalSize: dbSize[0]?.size || 'Unknown',
    };
  }

  async getInactiveUsers(days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.prisma.profile.findMany({
      where: {
        updatedAt: {
          lt: cutoff,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
