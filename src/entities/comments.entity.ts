import { ApiProperty } from '@nestjs/swagger';

export class CommentsEntity {
  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID коментария в формате uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'Отличная статья возьму на заметку!',
    description: 'Текст комментария',
  })
  text!: string;

  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID поста',
  })
  postId!: string;

  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID пользователя',
  })
  userId!: string;

  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время создания комментария',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время обновления комментария',
  })
  updatedAt!: string;
}
