import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Topic } from 'src/topics/entities/topic.entity';
import { Video } from './entities/video.entity';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [
    // 2. 여기에 Topic을 추가하여 TopicRepository가 생성되도록 합니다.
    TypeOrmModule.forFeature([Video, Topic]),
    AuthModule,
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
