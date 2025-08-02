import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: Request,
    @Body() body: {
      title: string;
      content: string;
      excerpt?: string;
      status?: string;
      tags?: string[];
    }
  ) {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return this.articleService.create({
      ...body,
      authorId: userId,
      status: body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : null,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      content?: string;
      excerpt?: string;
      status?: string;
      tags?: string[];
    }
  ) {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Check if article belongs to user
    const article = await this.articleService.findOne(Number(id));
    if (!article) {
      throw new Error('Article not found');
    }
    if (article.authorId !== userId) {
      throw new Error('Unauthorized');
    }

    const updateData = {
      ...body,
      publishedAt: body.status === 'published' && article.status !== 'published'
        ? new Date()
        : article.publishedAt,
    };

    return this.articleService.update(Number(id), updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Check if article belongs to user
    const article = await this.articleService.findOne(Number(id));
    if (!article) {
      throw new Error('Article not found');
    }
    if (article.authorId !== userId) {
      throw new Error('Unauthorized');
    }

    return this.articleService.delete(Number(id));
  }
}