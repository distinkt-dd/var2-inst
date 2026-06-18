import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID категории в формате uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'tech',
    description: 'Название категории',
  })
  name!: string;

  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время создания категории',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-18T06:45:41.217Z',
    description: 'Время обновления категории',
  })
  updatedAt!: string;
}
