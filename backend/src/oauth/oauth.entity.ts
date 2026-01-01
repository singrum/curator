// src/oauth/oauth.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['provider', 'providerId'])
export class OAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: string; // google | github | kakao

  @Column()
  providerId: string; // OAuth provider에서 내려주는 고유 ID

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
