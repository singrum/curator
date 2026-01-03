// src/videos/entities/video.entity.ts
import { Comment } from 'src/comments/entities/comment.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  videoId: string; // 유튜브 고유 ID

  @Column()
  title: string; // 영상 제목

  @Column()
  authorName: string; // 💡 유튜브 채널명 (단순 문자열 저장)

  @Column({ type: 'text', nullable: true })
  content: string; // 유저가 작성한 추가 설명 등

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => User, (user) => user.videos)
  @JoinColumn({ name: 'submitter_id' })
  submitter: User;

  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Comment[];

  @ManyToMany(() => Topic, (topic) => topic.videos, {
    cascade: true,
  })
  @JoinTable({
    name: 'video_topics',
    joinColumn: { name: 'video_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' },
  })
  topics: Topic[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "comment" WHERE "videoId" = ${alias}.id`,
  })
  commentCount?: number;
}
