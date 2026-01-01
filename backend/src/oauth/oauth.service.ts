// src/oauth/oauth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuth } from './oauth.entity';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuth)
    private readonly oauthRepo: Repository<OAuth>,
  ) {}

  find(provider: string, providerId: string) {
    return this.oauthRepo.findOne({
      where: { provider, providerId },
      relations: ['user'],
    });
  }

  create(data: Partial<OAuth>) {
    const oauth = this.oauthRepo.create(data);
    return this.oauthRepo.save(oauth);
  }
}
