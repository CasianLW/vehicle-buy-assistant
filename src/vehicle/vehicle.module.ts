import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { HistoryModule } from '../history/history.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppSettingsModule } from '../app-settings/app-settings.module';

@Module({
  imports: [HttpModule, ConfigModule, HistoryModule, AppSettingsModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
