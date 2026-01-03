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
import { UpdateVideoDto } from './dto/update-video.dto';
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
  private removeMarkdown(content: string): string {
    return content
      .replace(/[#*`~_]/g, '') // 주요 특수문자 제거
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크 텍스트만 남김
      .replace(/\n+/g, ' ') // 줄바꿈을 공백으로 변경
      .trim();
  }
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.submitter', 'submitter')
      .leftJoinAndSelect('video.topics', 'topics')
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
    console.log(items);

    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['submitter', 'topics'],
      select: {
        id: true,
        videoId: true,
        title: true,
        authorName: true,
        createdAt: true,
        score: true,
        content: true,
        topics: {
          id: true,
          name: true,
        },
        submitter: {
          id: true,
          nickname: true,
        },
      },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
