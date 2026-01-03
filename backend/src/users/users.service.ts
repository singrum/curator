import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
  /**
   * ID로 유저를 찾음
   * @param id 유저 PK
   * @returns User 엔티티
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`ID가 ${id}인 유저를 찾을 수 없음`);
    }

    return user;
  }

  // 닉네임 업데이트 시 이 findById를 활용함
  async updateNickname(userId: number, nickname: string) {
    const user = await this.findById(userId); // 공통 메서드 활용
    user.nickname = nickname;

    return this.userRepository.save(user);
  }
}
