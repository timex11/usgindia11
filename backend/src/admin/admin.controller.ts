import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AiService } from '../ai/ai.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAiSettingsDto } from '../ai/dto/update-ai-settings.dto';
import { UserRole } from '@shared/types/enums';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import type { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Controller('admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'system_admin') // Allow regular admins to access dashboard
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly aiService: AiService,
  ) {}

  @Get('stats')
  async getStats(): Promise<any> {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('ai-usage')
  async getAiUsage(): Promise<any> {
    return this.adminService.getAiUsage();
  }

  @Get('activity')
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Get('logs')
  getLogs() {
    return this.adminService.getLogs();
  }

  @Patch('profile/:userId')
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Param('userId') userId: string,
    @Body() profileData: UpdateProfileDto,
  ) {
    const adminId = request.user.sub || request.user.id;
    return this.adminService.updateProfile(userId, profileData, adminId);
  }

  @Post('command')
  async executeCommand(
    @Req() request: AuthenticatedRequest,
    @Body('command') command: string,
  ) {
    const userId = request.user.sub || request.user.id;
    return this.aiService.processAdminCommand(command, userId);
  }

  @Post('users/:userId/ban')
  async banUser(
    @Req() request: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    const adminId = request.user.sub || request.user.id;
    return this.adminService.banUser(userId, adminId);
  }

  @Post('users/:userId/unban')
  async unbanUser(
    @Req() request: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    const adminId = request.user.sub || request.user.id;
    return this.adminService.unbanUser(userId, adminId);
  }

  @Patch('users/:userId/role')
  async updateUserRole(
    @Req() request: AuthenticatedRequest,
    @Param('userId') userId: string,
    @Body('role') role: UserRole,
  ) {
    const adminId = request.user.sub || request.user.id;
    return this.adminService.updateUserRole(userId, role, adminId);
  }

  @Get('ai/settings')
  async getAiSettings() {
    return this.aiService.getSettings();
  }

  @Patch('ai/settings/:key')
  async updateAiSettings(
    @Param('key') key: string,
    @Body() value: UpdateAiSettingsDto,
  ) {
    return this.aiService.updateSettings(key, value);
  }

  @Post('users/bulk')
  async bulkAction(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      action: 'ban' | 'unban' | 'delete' | 'role_update';
      userIds: string[];
      data?: { role?: UserRole };
    },
  ) {
    const adminId = request.user.sub || request.user.id;
    return this.adminService.bulkAction(
      body.action,
      body.userIds,
      body.data || {},
      adminId,
    );
  }
}
