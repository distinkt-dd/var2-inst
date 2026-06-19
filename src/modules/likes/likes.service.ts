import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string, postId: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
      });

      if (!post) throw new NotFoundException('Пост не найден!');
      return await this.prismaService.like.create({
        data: { userId, postId },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('У вас уже стоит лайк под данным постом!');
      }
      throw error;
    }
  }

  async delete(userId: string, postId: string) {
    if (!userId || !postId) {
      throw new NotFoundException('Ошибка передачи параметров!');
    }

    const like = await this.prismaService.like.findFirst({
      where: { userId, postId },
    });

    if (!like) {
      throw new NotFoundException('Лайк не найден!');
    }

    return this.prismaService.like.delete({
      where: { id: like.id },
    });
  }

  async findByPost(postId: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Пост не найден!');

    return this.prismaService.like.findMany({
      where: { postId },
      include: { user: { select: { email: true } } },
    });
  }

  async checkLike(userId: string, postId: string) {
    const like = await this.prismaService.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return !!like;
  }
}
