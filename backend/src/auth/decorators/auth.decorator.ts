// src/auth/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Auth(...roles: number[]) {
  return applyDecorators(
    Roles(...roles),
    // 순서: 인증(JWT) 먼저, 그 다음 인가(Roles)
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
