import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { UserRole } from '../common/constants/role';
import { Video } from '../videos/entities/video.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * 0: 일반 유저 (General)
   * 1: 편집자 (Editor)
   * 2: 관리자 (Admin)
   */
  @Column({ type: 'int', default: UserRole.GENERAL })
  role: number;

  // 추가된 관계: 한 명의 유저는 여러 개의 게시글을 가질 수 있음
  @OneToMany(() => Video, (video) => video.submitter)
  videos: Video[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
