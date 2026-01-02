import { Video } from 'src/videos/entities/video.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 50 }) // 태그명 길이 제한 (인덱스 최적화)
  name: string;

  @ManyToMany(() => Video, (video) => video.topics)
  videos: Video[];
}
