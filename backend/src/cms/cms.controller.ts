import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async findAll() {
    return this.cmsService.findAll();
  }

  @Get(':slug')
  async getPage(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('moderator')
  async create(@Body() data: Prisma.CmsContentCreateInput) {
    return this.cmsService.create(data);
  }

  @Put(':id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('moderator')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.CmsContentUpdateInput,
  ) {
    return this.cmsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('moderator')
  async remove(@Param('id') id: string) {
    return this.cmsService.remove(id);
  }
}
