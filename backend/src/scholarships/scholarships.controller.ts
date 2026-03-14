import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { ApplicationStatus } from '@shared/types/enums';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Get()
  @Permissions('scholarships.read')
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.scholarshipsService.findAll({
      category,
      search,
      limit,
      offset,
    });
  }

  @Patch('applications/:id/status')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('scholarships.manage')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.scholarshipsService.updateApplicationStatus(
      id,
      status as ApplicationStatus,
    );
  }

  @Get('matches')
  @UseGuards(SupabaseAuthGuard)
  async findMatches(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id;
    return this.scholarshipsService.findMatches(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Post(':id/apply')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('scholarships.apply')
  async apply(
    @Param('id') scholarshipId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.id;
    return this.scholarshipsService.apply(userId, scholarshipId);
  }

  @Get('my/applications')
  @UseGuards(SupabaseAuthGuard)
  async getMyApplications(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id;
    return this.scholarshipsService.findApplicationsByUser(userId);
  }
}
