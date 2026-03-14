import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('team')
export class TeamController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body()
    data: {
      name: string;
      role: string;
      avatarUrl?: string;
      bio?: string;
      linkedin?: string;
      twitter?: string;
    },
  ) {
    return this.prisma.teamMember.create({
      data,
    });
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.prisma.teamMember.delete({
      where: { id },
    });
  }
}
