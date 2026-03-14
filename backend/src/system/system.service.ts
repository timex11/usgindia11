import { Injectable } from '@nestjs/common';
import * as systeminformation from 'systeminformation';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SystemService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('audit-log') private auditQueue: Queue,
    @InjectQueue('file-processing') private fileQueue: Queue,
    @InjectQueue('notification-dispatch') private notificationQueue: Queue,
  ) {}

  async getSystemStats() {
    const [cpu, mem, osInfo, currentLoad, diskLayout] = await Promise.all([
      systeminformation.cpu(),
      systeminformation.mem(),
      systeminformation.osInfo(),
      systeminformation.currentLoad(),
      systeminformation.diskLayout(),
    ]);

    // DB Stats (Postgres specific)
    let dbConnections = 0;
    try {
      const result = await this.prisma.$queryRaw<
        [{ count: number }]
      >`SELECT count(*)::int FROM pg_stat_activity;`;
      dbConnections = result[0]?.count || 0;
    } catch {
      // Fallback or ignore
    }

    // Queue Stats
    const queues = {
      email: await this.getQueueStats(this.emailQueue),
      audit: await this.getQueueStats(this.auditQueue),
      file: await this.getQueueStats(this.fileQueue),
      notification: await this.getQueueStats(this.notificationQueue),
    };

    return {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
        active: mem.active,
        available: mem.available,
      },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        codename: osInfo.codename,
        kernel: osInfo.kernel,
        arch: osInfo.arch,
        hostname: osInfo.hostname,
      },
      load: {
        avgLoad: currentLoad.avgLoad,
        currentLoad: currentLoad.currentLoad,
        currentLoadUser: currentLoad.currentLoadUser,
        currentLoadSystem: currentLoad.currentLoadSystem,
        currentLoadNice: currentLoad.currentLoadNice,
        currentLoadIdle: currentLoad.currentLoadIdle,
        currentLoadIrq: currentLoad.currentLoadIrq,
      },
      disk: diskLayout.map((disk) => ({
        device: disk.device,
        type: disk.type,
        name: disk.name,
        vendor: disk.vendor,
        size: disk.size,
      })),
      infrastructure: {
        database: {
          connections: dbConnections,
          type: 'PostgreSQL',
        },
        queues,
      },
    };
  }

  private async getQueueStats(queue: Queue) {
    if (!queue) return { waiting: 0, active: 0, failed: 0 };
    try {
      // If mock doesn't support getJobCounts, fallback
      if (!queue.getJobCounts) return { waiting: 0, active: 0, failed: 0 };
      const counts = await queue.getJobCounts('waiting', 'active', 'failed');
      return counts;
    } catch {
      return { waiting: 0, active: 0, failed: 0, error: 'Queue unavailable' };
    }
  }

  async getProcessStats() {
    const processes = await systeminformation.processes();
    return {
      all: processes.all,
      running: processes.running,
      blocked: processes.blocked,
      sleeping: processes.sleeping,
      list: processes.list.slice(0, 20), // Top 20 processes
    };
  }

  async globalSearch(query: string) {
    if (!query || query.length < 2) return [];

    const [universities, scholarships, jobs] = await Promise.all([
      this.prisma.university.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { location: { contains: query } },
          ],
        },
        take: 5,
      }),
      this.prisma.scholarship.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { provider: { contains: query } },
          ],
        },
        take: 5,
      }),
      this.prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { company: { contains: query } },
            { location: { contains: query } },
          ],
        },
        take: 5,
      }),
    ]);

    return [
      ...universities.map((u) => ({
        id: u.id,
        title: u.name,
        type: 'university',
        href: `/universities/${u.id}`,
      })),
      ...scholarships.map((s) => ({
        id: s.id,
        title: s.title,
        type: 'scholarship',
        href: `/scholarships/${s.id}`,
      })),
      ...jobs.map((j) => ({
        id: j.id,
        title: j.title,
        type: 'job',
        href: `/jobs/${j.id}`,
      })),
    ];
  }

  async getSettings() {
    const settings = await this.prisma.systemSetting.findMany();
    // Convert array to object for easier frontend consumption
    return settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  async updateSetting(key: string, value: string, description?: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  async updateSettings(settings: Record<string, string>) {
    const promises = Object.entries(settings).map(([key, value]) =>
      this.updateSetting(key, value),
    );
    return Promise.all(promises);
  }
}
