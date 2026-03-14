import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import type { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Controller('ai')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @Permissions('ai.chat')
  async chat(
    @Req() req: AuthenticatedRequest,
    @Body('message') message: string,
    @Body('conversationId') conversationId?: string,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.aiService.chat(userId, message, conversationId);
  }

  @Get('history')
  @Permissions('ai.chat')
  async getHistory(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub || req.user.id;
    return this.aiService.getChatHistory(userId);
  }

  @Post('generate')
  @Permissions('ai.analyze')
  async generate(@Body('prompt') prompt: string) {
    return this.aiService.generateResponse(prompt);
  }

  @Get('recommendations/:userId')
  @Permissions('ai.analyze')
  getRecommendations(
    @Param('userId') userId: string,
    @Query('type') type?: string,
  ) {
    return this.aiService.getRecommendations(userId, type);
  }
}
