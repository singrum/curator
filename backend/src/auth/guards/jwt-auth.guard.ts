// src/auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // 1. UsersService 주입 확인
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.jwt as string | undefined;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify<{ userId: number }>(token);

      // 2. 핵심: 페이로드의 userId로 DB에서 실제 유저 객체 조회
      const user = await this.usersService.findById(payload.userId);
      if (!user) throw new UnauthorizedException();

      // 3. req.user에 페이로드가 아닌 '실제 유저 엔티티'를 할당
      req.user = user;

      return true;
    } catch {
      // (기존의 refresh token 로직 생략...)
      throw new UnauthorizedException();
    }
  }
}
