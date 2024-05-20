import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(
    @Body() body: { userId: string; prompt: string; response: string },
  ) {
    return this.historyService.createHistory(
      body.userId,
      body.prompt,
      body.response,
    );
  }

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    return this.historyService.getHistoryByUserId(userId);
  }
}
