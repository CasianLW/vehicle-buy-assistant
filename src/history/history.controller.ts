import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(
    @Body()
    body: {
      userId: string;
      userLogged: boolean;
      prompt: string;
      response: string;
    },
  ) {
    if (!body.userId || !body.userLogged || !body.prompt || !body.response) {
      throw new BadRequestException('Missing required fields.');
    }
    return this.historyService.createHistory(
      body.userId,
      body.userLogged,
      body.prompt,
      body.response,
    );
  }

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    return this.historyService.getHistoryByUserId(userId);
  }
}
