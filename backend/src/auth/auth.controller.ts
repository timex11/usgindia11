import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from '../admin/dto/update-profile.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      loginDto.turnstileToken,
    );
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Patch('profile')
  @UseGuards(SupabaseAuthGuard)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.authService.updateProfile(userId, updateDto);
  }

  @Get('dashboard')
  @UseGuards(SupabaseAuthGuard)
  async getDashboard(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub || req.user.id;
    return this.authService.getDashboardData(userId);
  }

  @Get('admin')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminData() {
    return { message: 'This is protected admin data' };
  }
}
