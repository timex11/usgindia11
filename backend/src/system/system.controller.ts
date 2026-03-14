import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { SystemService } from './system.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('stats')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system stats (CPU, Mem, etc)' })
  async getStats() {
    return this.systemService.getSystemStats();
  }

  @Get('processes')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get running processes' })
  async getProcesses() {
    return this.systemService.getProcessStats();
  }

  @Get('settings')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all system settings' })
  async getSettings() {
    return this.systemService.getSettings();
  }

  @Post('settings')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system settings' })
  async updateSettings(@Body() settings: Record<string, string>) {
    return this.systemService.updateSettings(settings);
  }

  @Get('search')
  @ApiOperation({ summary: 'Global search across entities' })
  async search(@Query('q') query: string) {
    return this.systemService.globalSearch(query);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get public configuration' })
  async getPublicConfig() {
    const settings = await this.systemService.getSettings();
    // Whitelist public settings
    return {
      maintenanceMode: settings['maintenance_mode'] === 'true',
      allowRegistration: settings['allow_registration'] === 'true',
      primaryColor: settings['primary_color'],
      logoUrl: settings['logo_url'],
      faviconUrl: settings['favicon_url'],
      siteName: settings['site_name'],
    };
  }
}
