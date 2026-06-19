import { ApiProperty } from '@nestjs/swagger';

export class LikeEntity {
  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID лайка в формате uuid',
  })
  id!: string;

  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID пользователя, который поставил лайк',
  })
  userId!: string;

  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID поста, который лайкнули',
  })
  postId!: string;


  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время создания лайка',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время обновления лайка',
  })
  updatedAt!: string;
}
