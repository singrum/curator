import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import type { RequestWithUser } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Post(':videoId')
  @Auth() // 로그인 확인
  async create(
    @Param('videoId') videoId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.commentsService.create(
      +videoId,
      createCommentDto,
      req.user,
    );
  }

  @Get('video/:videoId')
  async findAllByVideo(@Param('videoId') videoId: string) {
    return await this.commentsService.findAllByVideo(+videoId);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.commentsService.remove(+id, req.user.id, req.user.role);
  }
}
