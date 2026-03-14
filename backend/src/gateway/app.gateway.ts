import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SupabaseService } from '../supabase/supabase.service';
import { WsSupabaseAuthGuard } from '../auth/guards/ws-supabase-auth.guard';
import { AuthenticatedSocket } from '../types/authenticated-request.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);
  private prisma: PrismaService;
  private supabaseService: SupabaseService;

  constructor(private moduleRef: ModuleRef) {}

  private getPrisma() {
    if (!this.prisma) {
      this.prisma = this.moduleRef.get(PrismaService, { strict: false });
    }
    return this.prisma;
  }

  private getSupabase() {
    if (!this.supabaseService) {
      this.supabaseService = this.moduleRef.get(SupabaseService, {
        strict: false,
      });
    }
    return this.supabaseService;
  }

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @Interval(60000) // Increase to 60 seconds to reduce database load
  async broadcastStats() {
    // Skip in dev if needed, or just let it run (it's async)
    try {
      const prisma = this.getPrisma();
      const [userCount, examCount, appCount] = await Promise.all([
        prisma.profile.count(),
        prisma.exam.count(),
        prisma.scholarshipApplication.count({ where: { status: 'SUBMITTED' } }),
      ]);

      this.server.emit('platform_stats', {
        activeUsers: userCount,
        totalExams: examCount,
        pendingApplications: appCount,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      this.logger.error(
        `Failed to broadcast stats: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthentication(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() token: string,
  ) {
    try {
      const { data, error } = await this.getSupabase()
        .getClient()
        .auth.getUser(token);
      if (error || !data.user) {
        client.disconnect();
        return { event: 'error', data: 'Unauthorized' };
      }

      // Join a personal room based on user ID
      await client.join(`user_${data.user.id}`);
      this.logger.log(
        `User ${data.user.id} authenticated and joined their personal room`,
      );

      return { event: 'authenticated', data: { userId: data.user.id } };
    } catch (err) {
      this.logger.error(
        `WebSocket Auth Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      client.disconnect();
    }
  }

  @UseGuards(WsSupabaseAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const roomId = data.roomId || 'general';
    await client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    return { event: 'joinedRoom', data: roomId };
  }

  @UseGuards(WsSupabaseAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; content: string },
  ) {
    const user = client.user;
    if (!user) return;

    try {
      const message = await this.getPrisma().chatMessage.create({
        data: {
          roomId: data.roomId,
          content: data.content,
          senderId: user.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      this.server.to(data.roomId).emit('newMessage', message);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`);
      return { error: 'Failed to send message' };
    }
  }

  // System methods
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
