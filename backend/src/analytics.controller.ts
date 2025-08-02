import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyAnalytics(@Req() req) {
    const user = req.user;
    if (!user || !user.id) {
      return { error: 'Unauthorized' };
    }
    return this.analyticsService.getUserAnalytics(user.id);
  }
}
