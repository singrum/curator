import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    videoId: number,
    createCommentDto: CreateCommentDto,
    user: { id: number },
  ) {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      video: { id: videoId }, // 연관 관계 ID만 넣어서 저장
      author: { id: user.id }, // 인증된 유저 ID 사용
    });

    const savedComment = await this.commentRepository.save(comment);

    // 저장 후 작성자 정보를 포함하여 반환 (프론트엔드 UI 갱신용)
    return this.findOne(savedComment.id);
  }

  async findAllByVideo(videoId: number) {
    return await this.commentRepository.find({
      where: { video: { id: videoId } },
      relations: ['author'],
      // select 옵션을 사용하여 필요한 컬럼만 지정합니다.
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          id: true, // ID는 관계 유지를 위해 보통 포함합니다.
          nickname: true, // 필요한 닉네임
          avatarUrl: true, // 아바타도 UI에 필요하므로 포함 권장
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    return comment;
  }

  async remove(id: number, userId: number, userRole: number) {
    const comment = await this.findOne(id);

    // 권한 확인: 작성자 본인이거나 어드민(2)인 경우만 삭제 가능
    const isAuthor = comment.author.id === userId;
    const isAdmin = userRole === 2;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.commentRepository.remove(comment);
    return { success: true, message: '댓글이 삭제되었습니다.' };
  }
}
