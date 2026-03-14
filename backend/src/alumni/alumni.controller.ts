import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';
import { ZodValidationPipe } from 'nestjs-zod';
import { MentorshipRequestDto } from './dto/mentorship-request.dto';
import { DonationDto } from './dto/donation.dto';

@Controller('alumni')
@UseGuards(SupabaseAuthGuard)
@UsePipes(ZodValidationPipe)
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  private getToken(request: AuthenticatedRequest): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) return '';
    return authHeader.split(' ')[1] || '';
  }

  @Get()
  async findAll(@Req() request: AuthenticatedRequest) {
    const token = this.getToken(request);
    return this.alumniService.findAll(token);
  }

  @Get('mentors')
  async getMentors(@Req() request: AuthenticatedRequest) {
    const token = this.getToken(request);
    return this.alumniService.getMentors(token);
  }

  @Post('mentorship-request')
  async requestMentorship(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MentorshipRequestDto,
  ) {
    const token = this.getToken(request);
    const userId = request.user.id;
    return this.alumniService.requestMentorship(
      token,
      dto.mentorId,
      userId,
      dto.message,
    );
  }

  @Post('donation')
  async processDonation(
    @Req() request: AuthenticatedRequest,
    @Body() dto: DonationDto,
  ) {
    const token = this.getToken(request);
    const userId = request.user.id;
    return this.alumniService.processDonation(
      token,
      userId,
      dto.amount,
      dto.purpose,
    );
  }
}
