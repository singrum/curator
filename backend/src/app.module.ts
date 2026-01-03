import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OAuthModule } from './oauth/oauth.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 만들면 모든 모듈에서 주입 가능
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    AuthModule, // ⭐️ 필수
    UsersModule,
    OAuthModule,
    TopicsModule,
    VideosModule,
    CommentsModule,
  ],
})
export class AppModule {}
