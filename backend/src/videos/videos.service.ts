import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/users/user.entity';
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
    const { videoId } = createVideoDto;

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
  // src/videos/videos.service.ts
  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.videoRepository.findAndCount({
      take: limit, // 가져올 개수
      skip: (page - 1) * limit, // 건너뛸 개수
      relations: ['submitter', 'topics'], // 필요한 관계 포함
      select: {
        id: true,
        videoId: true,
        title: true,
        authorName: true,
        createdAt: true,
        score: true,
        topics: {
          id: true,
          name: true,
        },
        submitter: {
          id: true,
          nickname: true,
        },
      },
      order: { createdAt: 'DESC' }, // 최신순 정렬
    });

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
