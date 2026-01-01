// src/auth/auth.controller.ts
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { OAuthProfile } from './types/oauth-profile';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // 1. 구글 로그인 시작
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport가 구글 로그인 페이지로 redirect
  }

  // 2. 로그인 후 callback 처리
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: OAuthProfile },
    @Res() res: Response,
  ) {
    const user = req.user; // Passport validate()에서 반환한 객체

    const { accessToken, refreshToken } =
      await this.authService.oauthLogin(user);
    // 디버깅 로그 추가
    console.log('Generated AccessToken:', accessToken);
    console.log('Generated RefreshToken:', refreshToken);
    // Access token
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15, // 15분 정도
      sameSite: 'lax',
      path: '/', // 전체 경로에서 사용 가능
    });

    // Refresh token
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일 정도
      sameSite: 'lax', // OAuth redirect 필요한 경우 none
      path: '/', // 전체 경로에서 사용 가능
    });

    // 클라이언트 리다이렉트
    return res.redirect('http://localhost:3000');
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token' });

    const { accessToken, user } =
      await this.authService.refreshToken(refreshToken);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { user };
  }

  @Auth()
  @Get('me')
  getProfile(@Req() req: Request) {
    // 가드(JwtAuthGuard)에서 성공하면 req.user가 채워져서 옵니다.
    if (!req.user) return { loggedIn: false };
    console.log(req.user);
    return {
      loggedIn: true,
      user: req.user,
    };
  }
}
