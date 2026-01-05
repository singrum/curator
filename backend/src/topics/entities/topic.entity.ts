import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Video } from '../../videos/entities/video.entity';

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
