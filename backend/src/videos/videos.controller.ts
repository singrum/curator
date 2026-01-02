import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import type { RequestWithUser } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @Auth() // 💡 로그인한 유저만 접근 가능하도록 보호
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Req() req: RequestWithUser,
  ) {
    // 1. 가드에 의해 req.user에 로그인한 유저 정보가 담겨있다고 가정합니다.
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('유저 정보를 찾을 수 없습니다.');
    }

    // 2. 서비스로 DTO와 유저 객체를 함께 전달
    return await this.videosService.createVideo(createVideoDto, user);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
