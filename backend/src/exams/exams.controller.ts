import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ExamsService } from './exams.service';
import { SupabaseAuthGuard } from '../shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '../shared/guards/permissions.guard';
import { Permissions } from '../shared/decorators/permissions.decorator';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('exams')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
@UsePipes(ZodValidationPipe)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // 5 minutes
  @Permissions('exams.read')
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // 5 minutes
  @Permissions('exams.read')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post()
  @Permissions('exams.create')
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Post(':id/attempt')
  startExam(@Req() request: AuthenticatedRequest, @Param('id') examId: string) {
    const userId = request.user.sub || request.user.id;
    return this.examsService.createAttempt(userId, examId);
  }

  @Post('attempts/:id/submit')
  submitExam(
    @Param('id') attemptId: string,
    @Body() submitExamDto: SubmitExamDto,
  ) {
    return this.examsService.submitAttempt(attemptId, submitExamDto.answers);
  }

  @Post('attempts/:id/log-event')
  logProctoringEvent() {
    // return this.examsService.logEvent(attemptId, logEventDto.eventType, logEventDto.eventData);
    return { success: true };
  }
}
