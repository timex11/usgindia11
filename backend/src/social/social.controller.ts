import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Controller('social')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('posts')
  @Permissions('social.write')
  async createPost(
    @Req() request: AuthenticatedRequest,
    @Body()
    data: { content: string; mediaUrls?: { url: string; type: string }[] },
  ) {
    const userId = request.user.id || request.user.sub;
    return this.socialService.createPost(userId, data.content, data.mediaUrls);
  }

  @Get('feed')
  @Permissions('social.read')
  async getFeed(
    @Req() request: AuthenticatedRequest,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = request.user.id || request.user.sub;
    return this.socialService.getFeed(
      userId,
      cursor,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('users/:id/follow')
  @Permissions('social.write')
  async followUser(
    @Req() request: AuthenticatedRequest,
    @Param('id') followingId: string,
  ) {
    const followerId = request.user.id || request.user.sub;
    return this.socialService.followUser(followerId, followingId);
  }

  @Delete('users/:id/follow')
  @Permissions('social.write')
  async unfollowUser(
    @Req() request: AuthenticatedRequest,
    @Param('id') followingId: string,
  ) {
    const followerId = request.user.id || request.user.sub;
    return this.socialService.unfollowUser(followerId, followingId);
  }

  @Post('posts/:id/like')
  @Permissions('social.write')
  async likePost(
    @Req() request: AuthenticatedRequest,
    @Param('id') postId: string,
  ) {
    const userId = request.user.id || request.user.sub;
    return this.socialService.likePost(userId, postId);
  }

  @Delete('posts/:id/like')
  @Permissions('social.write')
  async unlikePost(
    @Req() request: AuthenticatedRequest,
    @Param('id') postId: string,
  ) {
    const userId = request.user.id || request.user.sub;
    return this.socialService.unlikePost(userId, postId);
  }

  @Post('posts/:id/comments')
  @Permissions('social.write')
  async commentPost(
    @Req() request: AuthenticatedRequest,
    @Param('id') postId: string,
    @Body('content') content: string,
  ) {
    const userId = request.user.id || request.user.sub;
    return this.socialService.commentPost(userId, postId, content);
  }
}
