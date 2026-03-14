import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceType } from '@shared/types/enums';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    type?: string;
    subject?: string;
    universityId?: string;
  }) {
    const where: Prisma.ResourceWhereInput = {};
    if (filters.universityId) where.universityId = filters.universityId;
    if (filters.type) where.type = filters.type as ResourceType;
    if (filters.subject) where.subject = { contains: filters.subject };

    return this.prisma.resource.findMany({
      where,
      include: {
        university: { select: { name: true } },
        uploader: { select: { fullName: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.resource.findUnique({
      where: { id },
      include: {
        university: { select: { name: true } },
        uploader: { select: { fullName: true } },
      },
    });
  }

  async create(data: {
    title: string;
    type: ResourceType;
    fileUrl: string;
    uploaderId: string;
    subject?: string;
    universityId?: string;
  }) {
    return this.prisma.resource.create({
      data,
    });
  }

  async update(id: string, userId: string, data: Prisma.ResourceUpdateInput) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new Error('Resource not found');
    if (resource.uploaderId !== userId)
      throw new ForbiddenException('Not authorized');

    return this.prisma.resource.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
