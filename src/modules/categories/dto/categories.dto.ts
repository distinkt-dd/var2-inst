import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CategoriesDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'tech',
    type: String,
  })
  @IsString({ message: 'Название категории должно быть строкой' })
  @MinLength(3, { message: 'Минимальная длина названия категрии - 5 символов' })
  @MaxLength(66, {
    message: 'Максимальная длина названия категории - 66 символов',
  })
  name!: string;
}
