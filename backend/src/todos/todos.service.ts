import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: { title: string; priority: string; dueDate?: Date | null },
  ) {
    return this.prisma.todo.create({
      data: {
        title: data.title,
        priority: data.priority,
        dueDate: data.dueDate,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, data: Prisma.TodoUpdateInput) {
    return this.prisma.todo.updateMany({
      where: { id, userId },
      data,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.todo.deleteMany({
      where: { id, userId },
    });
  }
}
