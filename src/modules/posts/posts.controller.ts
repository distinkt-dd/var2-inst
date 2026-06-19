import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  PostBaseEntity,
  PostBriefEntity,
  PostEntity,
} from 'src/entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Получить все посты',
    description:
      'Возвращает список постов с поддержкой пагинации, фильтрации по категории, статусу и сортировкой. Возвращает краткую информацию об авторе и счетчик лайков.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [PostBriefEntity],
    description: 'Возвращает массив кратких объектов постов',
  })
  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.postsService.findAll(dto);
  }

  @ApiOperation({
    summary: 'Получить пост по id',
    description:
      'Возвращает детальную информацию о посте, включая полные данные автора, категорию и массив всех комментариев',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostEntity,
    description: 'Возвращает полный объект поста',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пост не найден',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID поста',
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @ApiOperation({
    summary: 'Создать пост',
    description:
      'Создание новой статьи. Доступно пользователям с ролью AUTHOR или MODERATOR',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostEntity,
    description: 'Возвращает созданный объект поста',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  create(@Body() data: CreatePostDto, @Request() req) {
    return this.postsService.create(data, req.user.id);
  }

  @ApiOperation({
    summary: 'Обновить пост',
    description:
      'Редактирование содержания или статуса поста. Доступно автору этого поста или модератору',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostBaseEntity,
    description: 'Возвращает обновленный объект поста',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Вы не имеете прав на редактирование этого поста',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID поста',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  update(@Param('id') id: string, @Body() data: UpdatePostDto, @Req() req) {
    return this.postsService.update(id, data, req.user.id, req.user.role);
  }

  @ApiOperation({
    summary: 'Удалить пост',
    description:
      'Полное удаление поста из системы. Доступно автору этого поста или модератору',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostBaseEntity,
    description: 'Возвращает удаленный объект поста',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Вы не имеете прав на удаление этого поста',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID поста',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user.id, req.user.role);
  }
}
