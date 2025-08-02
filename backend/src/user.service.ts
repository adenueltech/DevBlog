import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

// Only expose safe fields
export type UserSafe = Pick<User, 'id' | 'email' | 'name' | 'username' | 'avatar' | 'bio' | 'website' | 'location' | 'createdAt'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserSafe[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        website: true,
        location: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    email: string;
    password: string;
    name?: string;
    username?: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(
    id: number,
    data: {
      email?: string;
      name?: string;
      bio?: string;
      avatar?: string;
      website?: string;
      location?: string;
      username?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findArticlesByUserId(userId: number) {
    // Returns all articles for a given user
    return this.prisma.article.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
