import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '@shared/guards/supabase-auth.guard';
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { Permissions } from '@shared/decorators/permissions.decorator';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Controller('notifications')
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Permissions('notifications.read')
  async findAll(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id;
    return this.notificationsService.getMyNotifications(userId);
  }

  @Patch(':id/read')
  @Permissions('notifications.read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
