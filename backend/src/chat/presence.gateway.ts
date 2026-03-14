import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  namespace: '/presence',
  cors: { origin: '*' },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('PresenceGateway');
  private onlineUsers = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }

    let userSockets = this.onlineUsers.get(userId);
    if (!userSockets) {
      userSockets = new Set();
      this.onlineUsers.set(userId, userSockets);
      this.server.emit('userOnline', { userId });
      this.logger.log(`User ${userId} went online`);
    }
    userSockets.add(client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    const userSockets = this.onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(client.id);
      if (userSockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', { userId });
        this.logger.log(`User ${userId} went offline`);
      }
    }
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }
}
