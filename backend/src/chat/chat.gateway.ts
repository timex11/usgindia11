import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { WsSupabaseAuthGuard } from '../auth/guards/ws-supabase-auth.guard';
import { AuthenticatedSocket } from '../types/authenticated-request.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsSupabaseAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.roomId);
    this.logger.log(`Client ${client.id} joined room ${data.roomId}`);
    return { event: 'joinedRoom', data: { roomId: data.roomId } };
  }

  @UseGuards(WsSupabaseAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; content: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.user?.id || '22222222-2222-2222-2222-222222222222';

    // Save to database
    const message = await this.chatService.saveMessage(
      data.roomId,
      userId,
      data.content,
    );

    // Broadcast to room
    this.server.to(data.roomId).emit('newMessage', message);

    return { event: 'messageSent', data: message };
  }
}
