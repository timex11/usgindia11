import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async search(@Query('q') query: string, @Query('limit') limit?: string) {
    const results = await this.searchService.searchAll(
      query,
      limit ? parseInt(limit, 10) : 30,
    );
    return { success: true, data: results, meta: { total: results.length } };
  }

  @Get('exams')
  @UseGuards(SupabaseAuthGuard)
  async searchExams(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.searchService.searchExams(
      query,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('scholarships')
  @UseGuards(SupabaseAuthGuard)
  async searchScholarships(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchScholarships(
      query,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('jobs')
  @UseGuards(SupabaseAuthGuard)
  async searchJobs(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.searchService.searchJobs(
      query,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
