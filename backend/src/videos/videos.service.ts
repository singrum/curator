import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, user: User) {
    const { videoId } = createVideoDto;

    // 유튜브 oEmbed API 호출
    const { data } = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    const newVideo = this.videoRepository.create({
      videoId,
      title: data.title,
      authorName: data.author_name, // API에서 가져온 채널명 저장
      submitter: user, // 로그인한 제출자 유저 객체 연결
    });

    return await this.videoRepository.save(newVideo);
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
