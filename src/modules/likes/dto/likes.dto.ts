import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLikesDto {
  @ApiProperty({
    description: 'Id поста в uuid формате',
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    type: String,
  })
  @IsString({ message: 'id поста должен быть строкой' })
  postId!: string;
}

export class UpdateLikesDto extends PartialType(CreateLikesDto) {}
