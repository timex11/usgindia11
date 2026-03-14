import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  @Post(':roomId')
  async saveMessage(
    @Param('roomId') roomId: string,
    @Body('content') content: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || '22222222-2222-2222-2222-222222222222';
    return this.chatService.saveMessage(roomId, userId, content);
  }
}
