import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Номер страницы',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на одной странице',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Фильтрация по названию категории (частичное совпадение)',
    example: 'tech',
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Фильтрация по статусу поста',
    example: PostStatus.PUBLISHED,
    enum: PostStatus,
    type: String,
  })
  @IsOptional()
  @IsEnum(PostStatus, {
    message: 'Статус указан не корректно',
  })
  status?: PostStatus;

  @ApiPropertyOptional({
    description:
      'Сортировка: "newest" (по дате создания) или "popularity" (по количеству лайков)',
    example: 'popularity',
    enum: ['newest', 'popularity'],
    type: String,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'popularity';
}
