import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt.interface';

import { Request, Response } from 'express';
import { isDev } from 'src/common/utils/id-dev.utils';
import { AuthDto } from './dto/auth.dto';

import bcrypt from 'bcrypt';
import { TUser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: AuthDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new ConflictException('Пользователь с таким email уже существует!');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: 'READER',
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    return this.auth(res, user);
  }

  private generateTokens(id: string, role: Role) {
    const payload: JwtPayload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (this.JWT_ACCESS_TOKEN_TTL as any) || '5m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (this.JWT_REFRESH_TOKEN_TTL as any) || '3h',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookie(res: Response, value: string, exp: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires: exp,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'lax',
    });
  }

  private auth(res: Response, user: TUser) {
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.role,
    );

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    );

    const { password, ...userWithOutPass } = user;

    return { user: userWithOutPass, accessToken };
  }

  async login(res: Response, dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Неправильный email или пароль!');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new NotFoundException('Не правильный email или пароль');
    }

    return this.auth(res, user);
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedException('Пользователь не авторизован!');
      }

      const payload: JwtPayload =
        await this.jwtService.verifyAsync(refreshToken);

      if (payload) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
          },
        });

        if (!user) {
          throw new UnauthorizedException('Пользователь не авторизован!');
        }

        const { accessToken, refreshToken } = this.generateTokens(
          user.id,
          user.role,
        );

        this.setCookie(
          res,
          refreshToken,
          new Date(Date.now() + 1 * 3 * 60 * 60 * 1000),
        );

        return {
          accessToken,
        };
      }
    } catch (err) {
      throw new UnauthorizedException('Пользователь не авторизован!');
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Пользователь не авторизован!');
      }

      const accessToken = authHeader.split(' ')[1];

      const payload: JwtPayload =
        await this.jwtService.verifyAsync(accessToken);

      if (payload) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
          },
        });

        if (!user) {
          throw new NotFoundException('Пользователь не найден!');
        }
        return { user };
      }
    } catch (err) {
      throw new UnauthorizedException('Пользователь не авторизован!');
    }
  }

  async logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0));
    return true;
  }
}
