import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSettingsService } from './app-settings/app-settings.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appSettingsService = app.get(AppSettingsService);
  await appSettingsService.initializeSettings();
  await app.listen(3000);
}
bootstrap();
