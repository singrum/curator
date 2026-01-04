import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [
    // 💡 Topic 엔티티를 이 모듈에서 사용할 수 있도록 등록
    TypeOrmModule.forFeature([Topic]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  // 만약 다른 모듈(VideosModule 등)에서 TopicsService를 써야 한다면 export 추가
  exports: [TopicsService],
})
export class TopicsModule {}
