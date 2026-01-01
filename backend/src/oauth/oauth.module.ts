import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthController } from './oauth.controller';
import { OAuth } from './oauth.entity';
import { OAuthService } from './oauth.service';

@Module({
  imports: [TypeOrmModule.forFeature([OAuth])],
  providers: [OAuthService],
  controllers: [OAuthController],
  exports: [OAuthService],
})
export class OAuthModule {}
