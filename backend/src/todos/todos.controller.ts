import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Controller('todos')
@UseGuards(SupabaseAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() data: { title: string; priority: string; dueDate?: string },
  ) {
    const userId = req.user.sub || req.user.id;
    return this.todosService.create(userId, {
      title: data.title,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub || req.user.id;
    return this.todosService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() data: { completed?: boolean; title?: string; priority?: string },
  ) {
    const userId = req.user.sub || req.user.id;
    return this.todosService.update(id, userId, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub || req.user.id;
    return this.todosService.remove(id, userId);
  }
}
