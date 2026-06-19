import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, category, status, sortBy } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (category)
      where.category = { name: { contains: category, mode: 'insensitive' } };

    return await this.prismaService.post.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { email: true } },
        category: true,
        _count: { select: { likes: true } },
      },
      orderBy:
        sortBy === 'popularity'
          ? { likes: { _count: 'desc' } }
          : { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            email: true,
          },
        },
        category: true,
        comments: true,
      },
    });

    if (!post) throw new NotFoundException('Пост не найден');
    return post;
  }

  async create(data: CreatePostDto, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Ошибка создания: автор не найден!');
    }

    const category = await this.prismaService.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        'Указанная категория не найдена! Пожалуйста, выберите существующую категорию.',
      );
    }

    return this.prismaService.post.create({
      data: { ...data, authorId: userId },
    });
  }

  async update(
    id: string,
    data: UpdatePostDto,
    userId: string,
    userRole: Role,
  ) {
    const post = await this.findById(id);
    if (userRole !== Role.MODERATOR && post.authorId !== userId) {
      throw new ForbiddenException('Вы не можете изменить чужой пост!');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Ошибка создания: автор не найден!');
    }

    const category = await this.prismaService.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        'Указанная категория не найдена! Пожалуйста, выберите существующую категорию.',
      );
    }

    return this.prismaService.post.update({ where: { id }, data });
  }

  async delete(id: string, userId: string, userRole: Role) {
    const post = await this.findById(id);
    if (userRole !== Role.MODERATOR && post.authorId !== userId) {
      throw new ForbiddenException('Вы не можете удалить чужой пост!');
    }
    return this.prismaService.post.delete({ where: { id } });
  }

  async addLike(postId: string, userId: string) {
    return this.prismaService.like.create({ data: { postId, userId } });
  }
}
