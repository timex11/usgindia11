import { Injectable, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SocialService {
  constructor(
    private prisma: PrismaService,
    @Optional() @InjectQueue('feed-generation-queue') private feedQueue?: Queue,
  ) {}

  async createPost(
    userId: string,
    content: string,
    mediaUrls?: { url: string; type: string }[],
  ) {
    const post = await this.prisma.socialPost.create({
      data: {
        authorId: userId,
        content,
        mediaUrls: mediaUrls?.map((m) => m.url) || [],
      },
      include: { author: true },
    });

    if (this.feedQueue) {
      await this.feedQueue.add('new-post', {
        postId: post.id,
        authorId: userId,
      });
    }

    return post;
  }

  async getFeed(userId: string, cursor?: string, limit = 20) {
    const posts = await this.prisma.socialPost.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    return { data: posts, nextCursor };
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');

    return this.prisma.socialFollow.create({
      data: { followerId, followingId },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.prisma.socialFollow.deleteMany({
      where: { followerId, followingId },
    });
  }

  async likePost(userId: string, postId: string) {
    // Check if already liked to avoid errors if using create
    const existing = await this.prisma.socialLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) return existing;

    const like = await this.prisma.socialLike.create({
      data: { userId, postId },
    });

    await this.prisma.socialPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    return like;
  }

  async unlikePost(userId: string, postId: string) {
    try {
      await this.prisma.socialLike.delete({
        where: { postId_userId: { postId, userId } },
      });

      await this.prisma.socialPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
    } catch {
      // Ignore if not liked
    }

    return { success: true };
  }

  async commentPost(userId: string, postId: string, content: string) {
    const comment = await this.prisma.socialComment.create({
      data: { authorId: userId, postId, content },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await this.prisma.socialPost.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    return comment;
  }
}
