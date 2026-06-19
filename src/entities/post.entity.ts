import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { CategoryEntity } from './category.entity';
import { CommentsEntity } from './comments.entity';

class AuthorBriefEntity {
  @ApiProperty({ example: 'author@blog.com', description: 'Email автора' })
  email!: string;
}

class PostCountEntity {
  @ApiProperty({ example: 42, description: 'Количество лайков' })
  likes!: number;
}

export class PostBaseEntity {
  @ApiProperty({
    example: '8cc11d96-c5ef-4326-82d0-cc8eb9554d33',
    description: 'ID поста в формате uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'Статья №14: Технологии будущего',
    description: 'Заголовок статьи',
  })
  title!: string;

  @ApiProperty({
    example: 'Это очень интересный контент для статьи номер 14...',
    description: 'Содержание статьи',
  })
  content!: string;

  @ApiProperty({
    example: PostStatus.PUBLISHED,
    description: 'Статус поста (DRAFT или PUBLISHED)',
  })
  status!: PostStatus;

  @ApiProperty({
    example: '3d3603f0-84c8-4e9c-826d-42a67082c8e7',
    description: 'ID автора',
  })
  authorId!: string;

  @ApiProperty({
    example: '2e555a6a-2b19-41a6-a72d-8f88d34c5cc0',
    description: 'ID категории',
  })
  categoryId!: string;

  @ApiProperty({
    example: '2026-06-19T04:08:24.867Z',
    description: 'Дата создания',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-19T04:08:24.867Z',
    description: 'Дата обновления',
  })
  updatedAt!: string;
}

export class PostBriefEntity extends PostBaseEntity {
  @ApiProperty({
    type: AuthorBriefEntity,
    description: 'Краткие данные автора',
  })
  author!: AuthorBriefEntity;

  @ApiProperty({
    type: CategoryEntity,
    description: 'Данные категории',
  })
  category!: CategoryEntity;

  @ApiProperty({
    type: PostCountEntity,
    description: 'Счетчики лайков',
  })
  _count!: PostCountEntity;
}

export class PostEntity extends PostBaseEntity {
  @ApiProperty({
    type: AuthorBriefEntity,
    description: 'Данные автора (только email)',
  })
  author!: AuthorBriefEntity;

  @ApiProperty({
    type: CategoryEntity,
    description: 'Данные категории',
  })
  category!: CategoryEntity;

  @ApiProperty({
    type: [CommentsEntity],
    description: 'Список всех комментариев к посту',
  })
  comments!: CommentsEntity[];
}
