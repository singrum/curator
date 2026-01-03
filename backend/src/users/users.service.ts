import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // 1. 해당 닉네임을 사용 중인 유저가 있는지 확인
    const existingUser = await this.userRepository.findOne({
      where: { nickname },
    });

    // 2. 중복 체크 로직
    // 닉네임을 가진 사람이 있는데, 그게 '나'가 아니라면 중복 에러 발생
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    // 3. 내 정보 가져오기
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 4. 닉네임 변경 및 저장
    user.nickname = nickname;
    return this.userRepository.save(user);
  }
}
