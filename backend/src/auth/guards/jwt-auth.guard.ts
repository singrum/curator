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

export interface RequestWithUser extends Request {
  cookies: {
    jwt?: string;
    refresh_token?: string;
    [key: string]: string | undefined; // 다른 쿠키들도 허용하되 타입을 string으로 제한
  };
  user: { id: number };
} // src/auth/guards/jwt-auth.guard.ts

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

    // 1. 우선 액세스 토큰이 있다면 검증을 시도합니다.
    if (accessToken) {
      try {
        const payload = this.jwtService.verify<{ userId: number }>(accessToken);
        req.user = { id: payload.userId };
        return true; // 검증 성공 시 즉시 통과
      } catch {
        // 검증 실패(만료 등) 시 에러를 던지지 않고 아래 리프레시 로직으로 흐르게 합니다.
        console.log(
          'Access token invalid or expired, checking refresh token...',
        );
      }
    }

    // 2. 액세스 토큰이 없거나 검증에 실패한 경우 리프레시 토큰을 확인합니다.
    if (!refreshToken) {
      // 둘 다 없으면 비로소 401 에러를 던집니다.
      throw new UnauthorizedException('Authentication failed');
    }

    try {
      // 리프레시 토큰으로 새 액세스 토큰 발급
      const { accessToken: newAccessToken, user } =
        await this.authService.refreshToken(refreshToken);

      // 브라우저 쿠키 업데이트
      res.cookie('jwt', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      // 새로운 유저 정보 세팅
      req.user = { id: user.id };
      return true;
    } catch {
      // 리프레시 토큰마저 유효하지 않은 경우
      throw new UnauthorizedException('Session expired');
    }
  }
}
