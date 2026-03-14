import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  async getPosts() {
    return this.communityService.getFeed();
  }

  @Post('posts')
  async createPost(
    @Body('content') content: string,
    @Body('title') title: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || '22222222-2222-2222-2222-222222222222';
    return this.communityService.createPost(userId, content, title);
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id') postId: string) {
    return this.communityService.getPostComments(postId);
  }

  @Post('posts/:id/comments')
  async addComment(
    @Param('id') postId: string,
    @Body('content') content: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || '22222222-2222-2222-2222-222222222222';
    return this.communityService.addComment(postId, userId, content);
  }
}
