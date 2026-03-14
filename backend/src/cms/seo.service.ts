import { Injectable, Logger } from '@nestjs/common';
import { CmsService } from './cms.service';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(private readonly cmsService: CmsService) {}

  async getPageMetadata(slug: string) {
    try {
      const content = await this.cmsService.findBySlug(slug);
      return {
        title: `${content.title} | USG India`,
        description: content.body.substring(0, 160),
        keywords: 'education, scholarships, india, students',
        ogImage: 'https://usgindia.org/og-image.jpg',
        canonical: `https://usgindia.org/${slug}`,
      };
    } catch {
      this.logger.warn(
        `Could not find CMS content for slug: ${slug}, using defaults`,
      );
      return {
        title: 'USG India - Educational Platform',
        description: 'Advanced educational platform for students across India.',
        keywords: 'education, scholarships, india, students',
        ogImage: 'https://usgindia.org/og-image.jpg',
        canonical: `https://usgindia.org/${slug}`,
      };
    }
  }
}
