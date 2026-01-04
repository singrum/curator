import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
interface RawTopicResult {
  id: number;
  name: string;
  videoCount: string | number;
}
@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async findAll(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      // 1. 중간 테이블(video_topics) 조인 (상세 페이지에서 확인한 테이블명 사용)
      .leftJoin('video_topics', 'vt', 'vt.topic_id = topic.id')
      // 2. 비디오 개수 계산 및 별칭 부여
      .select([
        'topic.id AS id',
        'topic.name AS name',
        'COUNT(vt.video_id) AS videoCount',
      ])
      // 3. 그룹화 및 정렬 (비디오 개수 많은 순)
      .groupBy('topic.id')
      .orderBy('videoCount', 'DESC')
      .addOrderBy('topic.name', 'ASC')
      .offset(skip)
      .limit(limit);

    // 💡 getRawAndEntities 대신 정렬된 결과를 직접 가져오기 위해 getRawMany 사용
    const rawItems = await queryBuilder.getRawMany<RawTopicResult>();

    // 전체 개수 (페이지네이션용)
    const total = await this.topicRepository.count();

    // 4. 반환 형식에 맞춰 매핑
    const items = rawItems.map((row) => ({
      id: Number(row.id),
      name: row.name,
      videoCount: Number(row.videoCount),
    }));

    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
