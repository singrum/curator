import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Video } from './entities/video.entity';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // .env에 정의된 비밀키
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  // 만약 다른 모듈(예: UsersModule)에서 VideosService를 쓰고 싶다면 export 추가
  exports: [VideosService],
})
export class VideosModule {}
