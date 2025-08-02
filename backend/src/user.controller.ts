import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: Request) {
    // req.user is set by Passport after successful JWT validation
    // @ts-ignore
    const user = req.user;
    if (!user || !user.id) return user;
    // Get article stats
    const articles = await this.userService.findArticlesByUserId(user.id);
    const stats = {
      articles: articles.length,
      followers: 0, // Implement followers system if needed
      following: 0, // Implement following system if needed
      totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
      totalLikes: articles.reduce((sum, a) => sum + (a.likes || 0), 0),
    };
    // Provide default values for missing fields
    return {
      ...user,
      avatar: user.avatar || '',
      username: user.username || user.email?.split('@')[0] || '',
      bio: user.bio || '',
      joinedDate: user.createdAt || null,
      stats,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/articles')
  async getMyArticles(@Req() req: Request) {
    // req.user is set by Passport after successful JWT validation
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) return [];
    return this.userService.findArticlesByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  // User creation is now handled via /auth/register

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateMe(
    @Req() req: Request,
    @Body() body: {
      email?: string;
      name?: string;
      bio?: string;
      avatar?: string;
      website?: string;
      location?: string;
      username?: string;
    }
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.userService.update(userId, body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      email?: string;
      name?: string;
      bio?: string;
      avatar?: string;
      website?: string;
      location?: string;
      username?: string;
    }
  ) {
    return this.userService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
