import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Отличная статья! Возьму на заметку:)',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Текст комментария не может быть пустым' })
  @MaxLength(1000, { message: 'Комментарий не может превышать 1000 символов' })
  text!: string;

  @ApiProperty({
    description: 'Id поста в uuid формате',
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty({
    message: 'Необходимо указать ID статьи, к которой оставляется комментарий',
  })
  postId!: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
