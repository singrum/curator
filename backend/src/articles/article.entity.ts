import { Topic } from 'src/topics/topic.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User) // User 엔티티와 연결
  @JoinColumn({ name: 'createdBy' }) // 컬럼명은 그대로 유지 가능
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true }) // 관습대로 잘 유지됨
  videoId: string;

  @Column() // 'text' 대신 일반 varchar(255) 추천 (검색 인덱스 효율)
  title: string;

  @Column({ type: 'text', nullable: true }) // 본문은 긴 글일 수 있으니 text 추천
  content: string;

  @Column({ default: 0 })
  score: number;

  @ManyToMany(() => Topic, (topic) => topic.articles, {
    cascade: ['insert', 'update'], // 모든 작업보다는 삽입/수정 시에만 작동하도록 명시
  })
  @JoinTable({
    name: 'article_topics',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' },
  })
  topics: Topic[];
}
