import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Article } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Article[]> {
    return this.prisma.article.findMany({
      where: { status: 'published' },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });
  }

  async findOne(id: number): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true }
        }
      }
    });
  }

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    status: string;
    authorId: number;
    publishedAt?: Date | null;
  }): Promise<Article> {
    return this.prisma.article.create({
      data: {
        ...data,
        readTime: this.calculateReadTime(data.content),
      }
    });
  }

  async update(id: number, data: {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: string;
    publishedAt?: Date | null;
  }): Promise<Article> {
    const updateData: any = { ...data };
    
    if (data.content) {
      updateData.readTime = this.calculateReadTime(data.content);
    }

    return this.prisma.article.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: number): Promise<Article> {
    return this.prisma.article.delete({
      where: { id }
    });
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}