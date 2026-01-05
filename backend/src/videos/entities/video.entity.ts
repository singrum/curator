// src/videos/entities/video.entity.ts
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
import { Comment } from '../../comments/entities/comment.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  videoId: string;

  @Column()
  title: string;

  @Column({ default: '' })
  articleTitle: string;

  @Column()
  authorName: string;

  @Column({ default: '' })
  authorUrl: string;

  @Column({ type: 'text', nullable: true })
  content: string;

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
