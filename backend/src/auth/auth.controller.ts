// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import type { RequestWithUser } from './guards/jwt-auth.guard';
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
  async getProfile(@Req() req: RequestWithUser) {
    // 1. 가드에서 넣어준 req.user (예: { id: 1 })를 가져옵니다.
    // 가드에서 인증에 실패하면 이 컨트롤러에 도달하지 못하므로 null 체크는 간단하게 합니다.
    const authUser = req.user;

    if (!authUser || !authUser.id) {
      return { loggedIn: false };
    }

    try {
      // 2. 비즈니스 로직에 필요한 전체 유저 정보를 DB에서 조회합니다.
      const user = await this.usersService.findById(authUser.id);

      if (!user) {
        return { loggedIn: false };
      }

      // 3. 최종 유저 엔티티 객체 반환
      return {
        loggedIn: true,
        user,
      };
    } catch (error) {
      console.error('getProfile error:', error);
      return { loggedIn: false };
    }
  }

  @Auth() // 이전에 만든 JwtAuthGuard 적용
  @Patch('nickname')
  async changeNickname(
    @Req() req: RequestWithUser,
    @Body('nickname') nickname: string,
  ) {
    return this.usersService.updateNickname(req.user.id, nickname);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // 쿠키 만료 처리
    res.clearCookie('jwt', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out' };
  }
}
