import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';

@Controller('admissions')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post()
  @Permissions('admissions.create')
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createAdmissionDto: CreateAdmissionDto,
  ) {
    return this.admissionsService.create(req.user.id, createAdmissionDto);
  }

  @Get()
  @Permissions('admissions.read')
  findAll() {
    return this.admissionsService.findAll();
  }

  @Get('my')
  @Permissions('admissions.read')
  findMy(@Req() req: AuthenticatedRequest) {
    return this.admissionsService.findByUser(req.user.id);
  }

  @Get(':id')
  @Permissions('admissions.read')
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('admissions.manage')
  update(
    @Param('id') id: string,
    @Body() updateAdmissionDto: UpdateAdmissionDto,
  ) {
    return this.admissionsService.update(id, updateAdmissionDto);
  }

  @Delete(':id')
  @Permissions('admissions.manage')
  remove(@Param('id') id: string) {
    return this.admissionsService.remove(id);
  }
}
