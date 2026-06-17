import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt.interface';

import { Response } from 'express';
import { isDev } from 'src/common/utils/id-dev.utils';
import { User } from 'src/generated/prisma/client';

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

  private auth(res: Response, user: User) {
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
}
