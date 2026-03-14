import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats() {
    return this.statsService.getSystemStats();
  }

  @Get('db')
  async getDbStats() {
    return this.statsService.getDbStats();
  }
}
