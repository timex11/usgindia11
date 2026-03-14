import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  type: 'exam' | 'scholarship' | 'job' | 'post';
  id: string;
  title: string;
  subtitle: string;
  score: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Unified search across all entities
   */
  async searchAll(query: string, limit = 30): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const sanitized = query.trim();

    try {
      const [exams, scholarships, jobs] = await Promise.all([
        this.searchExams(sanitized, Math.ceil(limit / 3)),
        this.searchScholarships(sanitized, Math.ceil(limit / 3)),
        this.searchJobs(sanitized, Math.ceil(limit / 3)),
      ]);

      const results = [...exams, ...scholarships, ...jobs];
      results.sort((a, b) => b.score - a.score);

      return results.slice(0, limit);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Search failed for query '${query}': ${err.message}`);
      throw new HttpException(
        'Search service temporarily unavailable.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchExams(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const exams = await this.prisma.exam.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          isActive: true,
        },
        take: limit,
        select: { id: true, title: true, type: true },
      });

      return exams.map((e) => ({
        type: 'exam' as const,
        id: e.id,
        title: e.title,
        subtitle: e.type || 'Exam',
        score: 1.0,
      }));
    } catch {
      return [];
    }
  }

  async searchScholarships(
    query: string,
    limit: number,
  ): Promise<SearchResult[]> {
    try {
      const scholarships = await this.prisma.scholarship.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: { id: true, title: true, provider: true },
      });

      return scholarships.map((s) => ({
        type: 'scholarship' as const,
        id: s.id,
        title: s.title,
        subtitle: s.provider || 'Scholarship',
        score: 0.9,
      }));
    } catch {
      return [];
    }
  }

  async searchJobs(query: string, limit: number): Promise<SearchResult[]> {
    try {
      const jobs = await this.prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: { id: true, title: true, company: true },
      });

      return jobs.map((j) => ({
        type: 'job' as const,
        id: j.id,
        title: j.title,
        subtitle: j.company,
        score: 0.85,
      }));
    } catch {
      return [];
    }
  }
}
