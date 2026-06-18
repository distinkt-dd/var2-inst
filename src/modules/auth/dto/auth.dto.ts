import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Здесь нужно ввести свою почту',
    example: 'example@yandex.ru',
    type: String,
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @MinLength(3, { message: 'Минимальная длинна email - 3 символа' })
  email!: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'superSecretParol123',
    type: String,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(8, { message: 'Минимальная длина пароля - 8 символов' })
  @MaxLength(128, { message: 'Пароль не должен превышать 128 символов' })
  password!: string;
}
