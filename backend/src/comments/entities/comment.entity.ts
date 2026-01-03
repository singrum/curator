// src/comments/entities/comment.entity.ts
import { User } from 'src/users/user.entity';
import { Video } from 'src/videos/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 작성자 정보
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author: User;

  // 대상 영상 정보
  @ManyToOne(() => Video, (video) => video.comments, { onDelete: 'CASCADE' })
  video: Video;
}
