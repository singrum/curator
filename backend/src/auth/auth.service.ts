// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from '../oauth/oauth.service';
import { UsersService } from '../users/users.service';
import { OAuthProfile } from './types/oauth-profile';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly oauthService: OAuthService,
    private readonly jwtService: JwtService,
  ) {}

  async oauthLogin(profile: OAuthProfile) {
    const { provider, providerId, email, nickname, avatarUrl } = profile;

    // 1️⃣ OAuth 계정 조회
    let oauth = await this.oauthService.find(provider, providerId);

    // 2️⃣ 최초 로그인 → 회원가입
    if (!oauth) {
      const user = await this.usersService.create({
        email,
        nickname,
        avatarUrl,
        role: 0,
      });

      oauth = await this.oauthService.create({
        provider,
        providerId,
        user,
      });
    }

    // 3️⃣ JWT 발급
    const payload = { userId: oauth.user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh Token

    return {
      accessToken,
      refreshToken, // 반환해서 Controller에서 쿠키로 세팅 가능
      user: oauth.user,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ userId: number }>(token);
      const user = await this.usersService.findById(payload.userId);
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '15m' },
      );
      return { accessToken: newAccessToken, user };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
