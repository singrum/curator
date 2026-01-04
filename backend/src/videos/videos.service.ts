import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { remark } from 'remark';
import { User } from 'src/users/user.entity';
import strip from 'strip-markdown';
import { Repository } from 'typeorm';

import { Topic } from 'src/topics/entities/topic.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from './entities/video.entity';
import { YoutubeOEmbed } from './types/youtube';
@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, user: User) {
    console.log(createVideoDto);
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
      console.log(newVideo);
      return await this.videoRepository.save(newVideo);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('유효하지 않은 유튜브 비디오 ID입니다.');
      }
      throw error;
    }
  }
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // 1. 먼저 비디오 목록의 ID들을 가져옵니다 (페이징 보장)
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.submitter', 'submitter')
      .leftJoinAndSelect('video.topics', 'topics')
      .loadRelationCountAndMap('video.commentCount', 'video.comments')
      .select([
        'video.id',
        'video.videoId',
        'video.title',
        'video.articleTitle',
        'video.authorName',
        'video.createdAt',
        'video.score',
        'submitter.id',
        'submitter.nickname',
        'topics.id',
        'topics.name',
      ])
      // 💡 RAW 데이터 매핑 오류를 해결하기 위해 SUBSTRING 결과를 별칭으로 확실히 관리
      .addSelect('SUBSTRING(video.content, 1, 500)', 'video_content')
      .orderBy('video.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    // 💡 [해결] raw 데이터에서 각 비디오 ID에 맞는 content를 Map에 저장
    const contentMap = new Map();
    raw.forEach(
      (row: {
        video_content?: string;
        video_video_content?: string;
        video_id?: number;
      }) => {
        const content = row.video_content || row.video_video_content;
        const videoId = row.video_id;
        if (videoId && !contentMap.has(videoId)) {
          contentMap.set(videoId, content);
        }
      },
    );

    const items = await Promise.all(
      entities.map(async (entity) => {
        // 💡 인덱스가 아닌 엔티티 ID로 정확한 content를 찾아옴
        const rawMarkdown: string = (contentMap.get(entity.id) as string) || '';

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

    return { items, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }
  // src/videos/videos.service.ts

  async findOne(id: number) {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.submitter', 'submitter')
      .leftJoinAndSelect('video.topics', 'topics')
      // 1. 댓글 목록과 댓글 작성자를 함께 가져오기 위해 조인 추가
      .leftJoinAndSelect('video.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'author')
      // 2. 댓글 개수는 기존처럼 유지 (필요하다면)
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
        'video.score',
        'submitter.id',
        'submitter.nickname',
        'topics.id',
        'topics.name',
        // 3. 반환할 댓글 필드들 선택 (보안을 위해 필요한 것만)
        'comments.id',
        'comments.content',
        'comments.createdAt',
        'author.id',
        'author.nickname',
        'author.avatarUrl',
      ])
      // 4. 댓글을 최신순으로 정렬
      .orderBy('comments.createdAt', 'ASC');

    const video = await queryBuilder.getOne();

    if (!video) throw new NotFoundException('영상을 찾을 수 없습니다.');

    return video;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
