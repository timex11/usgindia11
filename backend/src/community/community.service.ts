import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
  ) {}

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
    const post = await this.prisma.socialPost.create({
      data: {
        authorId,
        content: title ? `${title}\n${content}` : content,
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true, collegeId: true },
        },
      },
    });

    // Notify users in the same college (sample implementation)
    if (post.author.collegeId) {
      // In a real app, you'd fetch college students and push to queue
      this.logger.log(`Post created by ${post.author.fullName}. Notify college peers...`);
    }

    return post;
  }

  async addComment(postId: string, authorId: string, content: string) {
    const comment = await this.prisma.socialComment.create({
      data: {
        postId,
        authorId,
        content,
      },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        post: {
          select: { authorId: true, content: true },
        },
      },
    });

    // Notify the post owner
    if (comment.post.authorId !== authorId) {
      await this.notificationQueue.add('dispatch', {
        userId: comment.post.authorId,
        title: 'New Comment',
        body: `${comment.author.fullName} commented on your post: "${content.substring(0, 30)}..."`,
        type: 'INFO',
      });
    }

    return comment;
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
