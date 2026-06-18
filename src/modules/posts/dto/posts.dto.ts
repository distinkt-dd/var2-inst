import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PostStatus } from 'src/generated/prisma/enums';

export class CreatePostDto {
  @ApiProperty({
    description: 'Заголовок статьи',
    example: 'Топ 5 инженерных идей для дома!',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Заголовок статьи обязателен' })
  @MaxLength(255, { message: 'Заголовок не может быть длиннее 255 символов' })
  title!: string;

  @ApiProperty({
    description: 'Содержание для статьи',
    example: 'Первый факт: .... Второй факт: ....',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Содержание статьи не может быть пустым' })
  content!: string;

  @ApiProperty({
    description: 'id категории в uuid формате',
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Необходимо указать ID категории' })
  categoryId!: string;

  @ApiProperty({
    description: 'Статусы DRAFT (черновик), либо PUBLISHED (опубликовано)',
    example: 'DRAFT',
    type: String,
  })
  @IsEnum(PostStatus, {
    message:
      'Статус должен быть либо DRAFT (черновик), либо PUBLISHED (опубликовано)',
  })
  status!: PostStatus;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
