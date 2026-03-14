import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(
    ownerId: string,
    name: string,
    description?: string,
    iconUrl?: string,
  ) {
    return this.prisma.workspace.create({
      data: {
        ownerId,
        name,
        description,
        iconUrl,
        members: {
          create: { userId: ownerId }, // Owner is also a member
        },
        channels: {
          create: [
            { name: 'general', type: 'text' }, // Create default channel
          ],
        },
      },
      include: { channels: true },
    });
  }

  async getWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        channels: true,
      },
    });
  }

  async getWorkspaceDetails(workspaceId: string) {
    return this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        channels: true,
        members: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async createChannel(
    workspaceId: string,
    name: string,
    type: string = 'text',
  ) {
    return this.prisma.channel.create({
      data: { workspaceId, name, type },
    });
  }

  async joinWorkspace(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.create({
      data: { workspaceId, userId },
    });
  }
}
