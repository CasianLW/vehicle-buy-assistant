import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSettingsService } from './app-settings/app-settings.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appSettingsService = app.get(AppSettingsService);
  await appSettingsService.initializeSettings();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
