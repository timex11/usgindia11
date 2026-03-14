import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { ApplicationStatus } from '@shared/types/enums';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @Permissions('jobs.read')
  async findAll(
    @Query('type') type?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    return this.jobsService.findAll({ type, location, search });
  }

  @Get('applications')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.manage')
  async findAllApplications() {
    return this.jobsService.findAllApplications();
  }

  @Get(':id')
  @Permissions('jobs.read')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.manage')
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.manage')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.manage')
  async remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Post(':id/apply')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.apply')
  async apply(
    @Param('id') jobId: string,
    @Req() request: AuthenticatedRequest,
    // @Body('resumeUrl') resumeUrl?: string,
  ) {
    const userId = request.user.id;
    // resumeUrl is currently unused in service
    return this.jobsService.apply(userId, jobId);
  }

  @Patch('applications/:id/status')
  @UseGuards(SupabaseAuthGuard, PermissionsGuard)
  @Permissions('jobs.manage')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.jobsService.updateApplicationStatus(
      id,
      status as ApplicationStatus,
    );
  }

  @Get('my/applications')
  @UseGuards(SupabaseAuthGuard)
  async getMyApplications(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id;
    return this.jobsService.findApplicationsByUser(userId);
  }
}
