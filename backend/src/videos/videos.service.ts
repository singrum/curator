import { Injectable } from '@nestjs/common';
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
  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
