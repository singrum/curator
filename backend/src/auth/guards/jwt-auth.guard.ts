// src/auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

import { Request, Response } from 'express';
import { cookieOptions } from '../constants/cookie-options';

export interface RequestWithUser extends Request {
  cookies: {
    jwt?: string;
    refresh_token?: string;
  };
  user: { id: number; role: number }; // role 타입 추가
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const res = context.switchToHttp().getResponse<Response>();

    const accessToken = req.cookies?.['jwt'];
    const refreshToken = req.cookies?.['refresh_token'];

    if (accessToken) {
      // 1. 토큰 생성 시점에 role을 넣었다면 여기서 바로 꺼낼 수 있습니다.
      const payload = this.jwtService.verify<{
        userId: number;
        role: number;
      }>(accessToken);
      req.user = { id: payload.userId, role: payload.role };
      return true;
    }

    if (!refreshToken) throw new UnauthorizedException('Authentication failed');

    try {
      // 2. 리프레시 시에는 어차피 DB를 거치는 경우가 많으므로,
      // authService.refreshToken이 유저의 최신 role 정보를 포함한 user 객체를 주도록 합니다.
      const { accessToken: newAccessToken, user } =
        await this.authService.refreshToken(refreshToken);

      res.cookie('jwt', newAccessToken, cookieOptions);

      req.user = { id: user.id, role: user.role }; // 갱신된 정보 주입
      return true;
    } catch {
      throw new UnauthorizedException('Session expired');
    }
  }
}
