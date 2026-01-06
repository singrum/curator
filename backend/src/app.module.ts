import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { OAuthModule } from './oauth/oauth.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 만들면 모든 모듈에서 주입 가능
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,

        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, // self-signed 인증서 오류 해결
          },
        },
      }),
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
