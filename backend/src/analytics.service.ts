import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserAnalytics(userId: number) {
    // Placeholder: aggregate real analytics here
    // Example: total views, likes, comments, followers, etc.
    const articles = await this.prisma.article.findMany({
      where: { authorId: userId },
      select: {
        views: true,
        likes: true,
        comments: true,
      },
    });
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);
    const totalComments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);
    return {
      totalViews,
      totalLikes,
      totalComments,
      articlesCount: articles.length,
    };
  }
}
