import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCommentDto, userId: string) {
    return this.prismaService.comment.create({ data: { ...data, userId } });
  }

  async findAllByPost(postId: string) {
    return this.prismaService.comment.findMany({ where: { postId } });
  }

  async findCommentById(id: string) {
    const comment = this.prismaService.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Коментарий не найден!');
    }
    return comment;
  }

  async update(
    id: string,
    data: UpdateCommentDto,
    userId: string,
    userRole: Role,
  ) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Комментарий не найден!');

    if (userRole !== Role.MODERATOR && comment.userId !== userId) {
      throw new ForbiddenException('Вы не можете изменять чужой комментарий!');
    }

    return this.prismaService.comment.update({ where: { id }, data });
  }

  async delete(id: string, userId: string, userRole: Role) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Комментарий не найден');

    if (userRole !== Role.MODERATOR && comment.userId !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужой комментарий');
    }
    return this.prismaService.comment.delete({ where: { id } });
  }
}
