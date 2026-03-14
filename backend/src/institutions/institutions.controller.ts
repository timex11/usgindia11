import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  UsePipes,
} from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { ZodValidationPipe } from 'nestjs-zod';
import { VerifyStudentDto } from './dto/verify-student.dto';
import { VerifySearchDto } from './dto/verify-search.dto';

@Controller('institutions')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
@UsePipes(ZodValidationPipe)
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  @Permissions('institutions.read')
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get('pending-verifications')
  @Permissions('institutions.manage')
  async getPendingVerifications(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    const collegeId = user.collegeId;
    if (!collegeId) return [];
    return this.institutionsService.getPendingVerifications(collegeId);
  }

  @Post('verify-student')
  @Permissions('institutions.manage')
  async verifyStudent(
    @Req() request: AuthenticatedRequest,
    @Body() dto: VerifyStudentDto,
  ) {
    const user = request.user;
    const collegeId = user.collegeId;
    if (!collegeId) throw new Error('No college associated with this admin');
    return this.institutionsService.verifyStudent(dto.studentId, collegeId);
  }

  @Get(':id')
  @Permissions('institutions.read')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Post('verify-search')
  @Permissions('institutions.manage')
  async verifySearch(@Body() dto: VerifySearchDto): Promise<unknown> {
    const results = await this.institutionsService.verifySearch(dto.name);
    return results;
  }
}
