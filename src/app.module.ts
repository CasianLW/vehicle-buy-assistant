import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { HistoryModule } from './history/history.module';
import { AppConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { LeboncoinService } from './scrapers/leboncoin/leboncoin.service';
// uncomment if ever you need scrapper, but know that it is not working because of the leboncoin bot protection
// maybe used to scrap other websites later
import { LeboncoinService } from './leboncoin/leboncoin.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { LeboncoinModule } from './leboncoin/leboncoin.module';
import { MobiledeCarsService } from './mobilede-cars/mobilede-cars.service';
import { MobiledeCarsController } from './mobilede-cars/mobilede-cars.controller';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    VehicleModule,
    HistoryModule,
    LeboncoinModule,
  ],
  controllers: [AppController, VehiclesController, MobiledeCarsController],
  providers: [AppService, LeboncoinService, MobiledeCarsService],
})
export class AppModule {}
