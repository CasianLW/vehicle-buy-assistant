import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from './schemas/history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  async createHistory(
    userId: string,
    prompt: string,
    response: string,
  ): Promise<History> {
    const newHistory = new this.historyModel({ userId, prompt, response });
    return newHistory.save();
  }

  async getHistoryByUserId(userId: string): Promise<History[]> {
    return this.historyModel.find({ userId }).exec();
  }
}
