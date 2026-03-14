import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return 'This action returns all knowledge articles';
  }

  findOne(id: string) {
    return `This action returns a #${id} knowledge article`;
  }
}
