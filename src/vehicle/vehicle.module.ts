import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { HistoryModule } from '../history/history.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule, HistoryModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
