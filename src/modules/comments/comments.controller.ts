import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CommentsEntity } from 'src/entities/comments.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Создать комментарий!',
    description: 'Создан для того, чтобы создать комментарий',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsEntity,
    description: 'Возвращает объект комментария!',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(dto, req.user.id);
  }

  @ApiOperation({
    summary: 'Получить комментарий по id поста',
    description: 'Создан для того, чтобы получить комментарий по id поста',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsEntity,
    description: 'Возвращает объект комментария!',
  })
  @Get('post/:postId')
  findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }

  @ApiOperation({
    summary: 'Получить комментарий по id!',
    description: 'Создан для того, чтобы получить комментарий по id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsEntity,
    description: 'Возвращает объект комментария!',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @ApiOperation({
    summary: 'Обновить комментарий!',
    description: 'Создан для того, чтобы обновить комментарий',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsEntity,
    description: 'Возвращает объект комментария!',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() data: UpdateCommentDto, @Req() req) {
    return this.commentsService.update(id, data, req.user.id, req.user.role);
  }

  @ApiOperation({
    summary: 'Удалить комментарий!',
    description: 'Создан для того, чтобы удалить комментарий',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsEntity,
    description: 'Возвращает объект комментария!',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  delete(@Param('id') id: string, @Req() req) {
    return this.commentsService.delete(id, req.user.id, req.user.role);
  }
}
