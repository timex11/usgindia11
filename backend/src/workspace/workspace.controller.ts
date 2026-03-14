import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('workspaces')
@UseGuards(SupabaseAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @Req() request: AuthenticatedRequest,
    @Body() data: { name: string; description?: string; iconUrl?: string },
  ) {
    const userId = request.user.id || request.user.sub;
    return this.workspaceService.createWorkspace(
      userId,
      data.name,
      data.description,
      data.iconUrl,
    );
  }

  @Get()
  async getWorkspaces(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id || request.user.sub;
    return this.workspaceService.getWorkspaces(userId);
  }

  @Get(':id')
  async getWorkspaceDetails(@Param('id') id: string) {
    return this.workspaceService.getWorkspaceDetails(id);
  }

  @Post(':id/channels')
  async createChannel(
    @Param('id') workspaceId: string,
    @Body() data: { name: string; type?: string },
  ) {
    return this.workspaceService.createChannel(
      workspaceId,
      data.name,
      data.type,
    );
  }

  @Post(':id/join')
  async joinWorkspace(
    @Req() request: AuthenticatedRequest,
    @Param('id') workspaceId: string,
  ) {
    const userId = request.user.id || request.user.sub;
    return this.workspaceService.joinWorkspace(workspaceId, userId);
  }
}
