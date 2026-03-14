import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cmsContent.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const content = await this.prisma.cmsContent.findUnique({
      where: { slug },
    });
    if (!content) {
      throw new NotFoundException(`Content with slug ${slug} not found`);
    }
    return content;
  }

  async create(data: {
    slug: string;
    title: string;
    body: string;
    status?: string;
  }) {
    return this.prisma.cmsContent.create({
      data: {
        slug: data.slug,
        title: data.title,
        body: data.body,
        status: data.status || 'draft',
      },
    });
  }

  async update(id: string, data: Prisma.CmsContentUpdateInput) {
    return this.prisma.cmsContent.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.cmsContent.delete({
      where: { id },
    });
  }
}
