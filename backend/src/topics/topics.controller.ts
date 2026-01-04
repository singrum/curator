import { Controller, Get, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.topicsService.findAll(page);
  }
}
