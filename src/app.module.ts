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
import { MobiledeCarsService } from './mobilede-cars/mobilede-cars.service';
import { MobiledeCarsController } from './mobilede-cars/mobilede-cars.controller';
import { AppSettingsController } from './app-settings/app-settings.controller';
import { AppSettingsModule } from './app-settings/app-settings.module';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
// import { AuthService } from './auth/auth.service';
// import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    VehicleModule,
    HistoryModule,
    AppSettingsModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    AppController,
    MobiledeCarsController,
    AppSettingsController,
    UserController,
    // AuthController,
  ],
  providers: [AppService, MobiledeCarsService, EmailService],
  // providers: [AppService, MobiledeCarsService, UserService, AuthService],
})
export class AppModule {}
