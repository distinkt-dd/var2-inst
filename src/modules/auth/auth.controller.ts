import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interseptor';
import {
  AuthEntity,
  OnlyAccessTokenEntity,
  OnlyUserEntity,
} from 'src/entities/auth.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Зарегистрироваться',
    description: 'Регистрирует пользователя в системе и авторизовывет его!',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthEntity,
    description: 'Возвращает объект пользователя и access токен',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto,
  ) {
    return await this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Авторизация',
    description: 'Авторизовывает пользователя!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthEntity,
    description: 'Возвращает объект пользователя и access токен',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
    return await this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Получить пользователя',
    description: 'Создан для того, чтобы бесшовно заходить в приложение!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OnlyUserEntity,
    description: 'Возвращает объект пользователя',
  })
  @ApiBearerAuth()
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.getUser(req, res);
  }

  @ApiOperation({
    summary: 'Обновить пару токенов!',
    description:
      'Создан для того, чтобы при истечении срока access Token, обновлять его refresh - токеном',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OnlyAccessTokenEntity,
    description:
      'Возвращает access Token, и записывает новый refresh токен в серверные куки',
  })
  @UseInterceptors(ResponseInterceptor)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Серверный выход из приложения!',
    description: 'Создан для выхода из приложения!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Очищает серверные куки, тем самым пользователь больше не сможет обновить токены и зайти на сайт без повторной авторизации!',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }
}
