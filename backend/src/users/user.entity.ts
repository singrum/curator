import { Video } from 'src/videos/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  // 추가된 관계: 한 명의 유저는 여러 개의 게시글을 가질 수 있음
  @OneToMany(() => Video, (video) => video.submitter)
  videos: Video[];
}
