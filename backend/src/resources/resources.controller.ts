import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import type { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { ResourceType } from '@shared/types/enums';
import { Prisma } from '@prisma/client';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('subject') subject?: string,
    @Query('universityId') universityId?: string,
  ) {
    return this.resourcesService.findAll({ type, subject, universityId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('resources.create')
  async create(
    @Req() request: AuthenticatedRequest,
    @Body()
    data: {
      title: string;
      type: ResourceType;
      fileUrl: string;
      subject?: string;
      universityId?: string;
    },
  ) {
    const userId = request.user.id;
    return this.resourcesService.create({
      ...data,
      uploaderId: userId,
    });
  }

  @Put(':id')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('resources.update')
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: Prisma.ResourceCreateInput,
  ) {
    const userId = request.user.id;
    return this.resourcesService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('resources.delete')
  async remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
