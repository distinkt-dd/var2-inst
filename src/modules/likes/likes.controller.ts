import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LikeEntity } from 'src/entities/likes.entity';
import { CreateLikesDto } from './dto/likes.dto';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: 'Поставить лайк',
    description:
      'Позволяет авторизованному пользователю добавить лайк к конкретному посту',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LikeEntity,
    description: 'Возвращает объект лайка',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ошибка: лайк уже существует',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req, @Body() body: CreateLikesDto) {
    return this.likesService.create(req.user.id, body.postId);
  }

  @ApiOperation({
    summary: 'Убрать лайк',
    description: 'Удаляет лайк пользователя с указанного поста',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LikeEntity,
    description: 'Возвращает удаленный объект лайка',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Лайк не найден',
  })
  @ApiBearerAuth()
  @Delete()
  @UseGuards(AuthGuard)
  async delete(@Req() req, @Body() body: CreateLikesDto) {
    return this.likesService.delete(req.user.id, body.postId);
  }

  @ApiOperation({
    summary: 'Получить лайки поста',
    description:
      'Возвращает список всех пользователей, которые поставили лайк данному посту',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [LikeEntity],
    description: 'Возвращает массив лайков с данными пользователей',
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'UUID поста',
  })
  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.likesService.findByPost(postId);
  }

  @ApiOperation({
    summary: 'Проверить наличие лайка',
    description:
      'Проверяет, поставил ли текущий авторизованный пользователь лайк на данный пост',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Возвращает true, если лайк есть, иначе false',
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'UUID поста',
  })
  @ApiBearerAuth()
  @Get('check/:postId')
  @UseGuards(AuthGuard)
  async check(@Param('postId') postId: string, @Req() req) {
    return this.likesService.checkLike(req.user.id, postId);
  }
}
