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
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from './entities/video.entity';
import { YoutubeOEmbed } from './types/youtube';
@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, user: User) {
    const { videoId, content } = createVideoDto;

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

      // 3. 비디오 생성 및 저장
      const newVideo = this.videoRepository.create({
        videoId,
        title: data.title,
        authorName: data.author_name,
        content: content,
        submitter: user,
      });

      return await this.videoRepository.save(newVideo);
    } catch (error) {
      // 유튜브 API 호출 실패 시 에러 처리 (예: 잘못된 videoId)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('유효하지 않은 유튜브 비디오 ID입니다.');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.submitter', 'submitter')
      .leftJoinAndSelect('video.topics', 'topics')
      .loadRelationCountAndMap('video.commentCount', 'video.comments')
      .select([
        'video.id',
        'video.videoId',
        'video.title',
        'video.authorName',
        'video.createdAt',
        'video.score',
        'submitter.id',
        'submitter.nickname',
        'topics.id',
        'topics.name',
      ])
      // 마크다운 기호가 포함된 상태로 자르면 문법이 깨질 수 있으므로 충분히 가져옴 (500자)
      .addSelect('SUBSTRING(video.content, 1, 500)', 'video_content')
      .orderBy('video.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const typedRaw = raw as Array<{ video_content: string }>;

    // 1. 비동기 마크다운 제거 처리를 위해 Promise.all 사용
    const items = await Promise.all(
      entities.map(async (entity, index) => {
        const rawMarkdown = typedRaw[index].video_content || '';

        // 2. remark를 사용하여 마크다운 태그 제거
        const processed = await remark().use(strip).process(rawMarkdown);

        // 3. 텍스트로 변환 후 줄바꿈 정리 및 최종 글자수 제한 (예: 150자)
        const plainText = String(processed)
          .replace(/\n+/g, ' ') // 줄바꿈을 공백으로 치환
          .trim()
          .slice(0, 150);

        return {
          ...entity,
          content: plainText,
        };
      }),
    );

    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
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
        'video.authorName',
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
