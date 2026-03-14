import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFeed() {
    return this.prisma.socialPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        comments: true,
      },
    });
  }

  async createPost(authorId: string, content: string, title?: string) {
    return this.prisma.socialPost.create({
      data: {
        authorId,
        content: title ? `${title}\n${content}` : content,
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async addComment(postId: string, authorId: string, content: string) {
    return this.prisma.socialComment.create({
      data: {
        postId,
        authorId,
        content,
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async getPostComments(postId: string) {
    return this.prisma.socialComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }
}
