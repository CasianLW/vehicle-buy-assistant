import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from '../schemas/history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  async createHistory(
    userId: string,
    userLogged: boolean,
    prompt: string,
    response: string,
  ): Promise<History> {
    if (!userLogged) {
      throw new BadRequestException(
        'User must be logged in to create history.',
      );
    }
    if (!userId || !prompt || !response) {
      throw new BadRequestException('Missing required fields.');
    }
    const newHistory = await this.historyModel.create({
      userId,
      prompt,
      response,
    });
    return newHistory.save();
  }

  async getHistoryByUserId(userId: string): Promise<History[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    const history = await this.historyModel.find({ userId }).exec();
    if (!history.length) {
      throw new NotFoundException('No history found for the provided user ID.');
    }
    return history;
  }
}
