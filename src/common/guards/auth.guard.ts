import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt.interface';

export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Вы не авторизованы или токен отсутствует',
        );
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Токен не указан');
      }
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return true;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
      }
      throw new UnauthorizedException('Токен невалиден или истёк');
    }
  }
}
