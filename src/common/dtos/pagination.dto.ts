import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PostStatus } from 'src/generated/prisma/enums';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(PostStatus, {
    message: 'Статус указан не корректно',
  })
  status?: PostStatus;

  @IsOptional()
  @IsString()
  sortBy?: 'newest' | 'popularity';
}
