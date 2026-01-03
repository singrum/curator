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
        role: 0, // 기본 권한 부여
      });

      oauth = await this.oauthService.create({
        provider,
        providerId,
        user,
      });
    }

    // 3️⃣ JWT 발급 시 role 정보를 포함합니다.
    // 💡 oauth.user에 role이 담겨 있어야 합니다 (Relations 확인 필요)
    const payload = {
      userId: oauth.user.id,
      role: oauth.user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: oauth.user,
    };
  }

  async refreshToken(token: string) {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify<{ userId: number }>(token);

      // DB에서 최신 유저 정보를 가져와서 현재의 role을 확인합니다.
      const user = await this.usersService.findById(payload.userId);
      if (!user) throw new UnauthorizedException();

      // 새로운 액세스 토큰 발급 시에도 role을 포함합니다.
      const newAccessToken = this.jwtService.sign(
        { userId: user.id, role: user.role }, // 💡 role 추가
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken, user };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
