import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSettings } from '../schemas/app-settings.schema';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectModel(AppSettings.name) private appSettingsModel: Model<AppSettings>,
  ) {}

  async initializeSettings() {
    const settings = await this.appSettingsModel.findOne();
    if (!settings) {
      const defaultAppSettings = {
        aiSelected: 'mistral',
        modelForMistral: 'open-mistral-7b',
        modelForOpenAI: 'gpt-3.5-turbo',
        modelForClaude: 'claude-3-haiku-20240307',
      };
      await new this.appSettingsModel(defaultAppSettings).save();
    }
  }

  async getAppSettings(): Promise<AppSettings> {
    return this.appSettingsModel.findOne().exec();
  }

  async updateAppSettings(
    settings: Partial<AppSettings>,
  ): Promise<AppSettings> {
    const currentSettings = await this.getAppSettings();
    if (currentSettings) {
      await this.appSettingsModel.updateOne({}, settings).exec();
      return this.appSettingsModel.findOne().exec();
    } else {
      return this.appSettingsModel.create(settings);
    }
  }
}
