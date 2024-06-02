import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsController } from './app-settings.controller';
import { AppSettings, AppSettingsSchema } from '../schemas/app-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppSettings.name, schema: AppSettingsSchema },
    ]),
  ],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
