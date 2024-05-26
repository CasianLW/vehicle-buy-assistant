import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { HistoryModule } from './history/history.module';
import { AppConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeboncoinService } from './scrapers/leboncoin/leboncoin.service';
import { LeboncoinController } from './scrapers/leboncoin/leboncoin.controller';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    VehicleModule,
    HistoryModule,
  ],
  controllers: [AppController, LeboncoinController],
  providers: [AppService, LeboncoinService],
})
export class AppModule {}
