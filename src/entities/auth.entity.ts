import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';

export class UserEntity {
  @ApiProperty({
    example: '0f90de39-9cb1-474f-9706-6497946f9bf0',
    description: 'ID пользователя в формате uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'example@yandex.ru',
    description: 'Email пользователя',
  })
  email!: string;

  @ApiProperty({
    example: 'AUTHOR',
    description: 'Роль пользователя',
  })
  role!: Role;
}

export class AuthEntity {
  @ApiProperty({ type: UserEntity })
  user!: UserEntity;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6S...',
    description: 'JWT токен для доступа к защищенным маршрутам',
  })
  accessToken!: string;
}

export class OnlyUserEntity {
  @ApiProperty({ type: UserEntity })
  user!: UserEntity;
}

export class OnlyAccessTokenEntity {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6S...',
    description: 'JWT токен для доступа к защищенным маршрутам',
  })
  accessToken!: string;
}
