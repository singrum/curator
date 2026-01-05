import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

import { Topic } from '../topics/entities/topic.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from './entities/video.entity';
import { YoutubeOEmbed } from './types/youtube';

interface VideoRawResult {
  video_id: number;
  video_content?: string;
  video_video_content?: string; // 드라이버에 따라 이름이 달라질 수 있음
}

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, user: User) {
    const {
      videoId,
      content,
      articleTitle,
      topics: topicsArr,
    } = createVideoDto;

    // 1. 이미 등록된 비디오인지 확인
    const existingVideo = await this.videoRepository.findOne({
      where: { videoId },
    });

    if (existingVideo) {
      throw new ConflictException('이미 등록된 비디오입니다.');
    }

    // 2. 유튜브 oEmbed API 호출
    try {
      const { data } = await axios.get<YoutubeOEmbed>(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      );

      const topics: Topic[] = await Promise.all(
        topicsArr.map(async (name): Promise<Topic> => {
          // 이미 존재하는 태그인지 확인
          let topic = await this.topicRepository.findOne({ where: { name } });
          if (!topic) {
            // 없으면 새로 생성
            topic = this.topicRepository.create({ name });
            await this.topicRepository.save(topic);
          }
          return topic;
        }),
      );

      // 4. 비디오 생성 및 저장
      const newVideo = this.videoRepository.create({
        videoId,
        title: data.title, // 입력된 제목이 없으면 유튜브 제목 사용
        authorName: data.author_name,
        authorUrl: data.author_url,
        articleTitle: articleTitle,
        content: content,
        submitter: user,
        topics: topics, // 처리된 태그 배열 연결
      });

      return await this.videoRepository.save(newVideo);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('유효하지 않은 유튜브 비디오 ID입니다.');
      }
      throw error;
    }
  }

  private getBaseQueryBuilder() {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.topics', 'topics')
      .loadRelationCountAndMap('video.commentCount', 'video.comments')
      .select([
        'video.id',
        'video.videoId',
        'video.title',
        'video.articleTitle',
        'video.authorName',
        'video.createdAt',
        'topics.name',
      ])
      .addSelect('SUBSTRING(video.content, 1, 500)', 'video_content');
  }

  private async processRawAndEntities(entities: Video[], raw: any[]) {
    const typedRaw = raw as VideoRawResult[];
    const contentMap = new Map<number, string>();

    typedRaw.forEach((row) => {
      const content = row.video_content || row.video_video_content;
      const videoId = row.video_id;
      if (videoId && !contentMap.has(videoId)) {
        contentMap.set(videoId, content || '');
      }
    });

    return Promise.all(
      entities.map(async (entity) => {
        const rawMarkdown = contentMap.get(entity.id) || '';
        const processed = await remark().use(strip).process(rawMarkdown);
        const plainText = String(processed)
          .replace(/\n+/g, ' ')
          .trim()
          .slice(0, 150);

        return {
          ...entity,
          content: plainText,
        };
      }),
    );
  }

  /**
   * 전체 목록 조회
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.getBaseQueryBuilder()
      .orderBy('video.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const items = await this.processRawAndEntities(entities, raw);

    return { items, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }

  /**
   * 토픽별 목록 조회
   */
  async findAllByTopic(
    topicName: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.getBaseQueryBuilder()
      .innerJoin(
        'video.topics',
        'filterTopic',
        'filterTopic.name = :topicName',
        { topicName },
      )
      .orderBy('video.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const items = await this.processRawAndEntities(entities, raw);

    return { items, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.topics', 'topics')
      .leftJoinAndSelect('video.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'author')
      .loadRelationCountAndMap('video.commentCount', 'video.comments')
      .where('video.id = :id', { id })
      .select([
        'video.id',
        'video.videoId',
        'video.title',
        'video.articleTitle',
        'video.authorName',
        'video.authorUrl',
        'video.content',
        'video.createdAt',
        'topics.id',
        'topics.name',
        'author.id',
        'author.nickname',
        'comments.id',
        'comments.content',
        'comments.createdAt',
      ])
      .orderBy('comments.createdAt', 'ASC');

    const video = await queryBuilder.getOne();

    if (!video) throw new NotFoundException('영상을 찾을 수 없습니다.');

    return video;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
