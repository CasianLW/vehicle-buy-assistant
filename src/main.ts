import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSettingsService } from './app-settings/app-settings.service';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const allowedOrigins = [
    process.env.LANDING_PAGE_URL || 'http://localhost:3001',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.error(`Blocked CORS for origin: ${origin}`);
        callback(new Error('CORS not allowed for this origin'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API Documentation setup
  const config = new DocumentBuilder()
    .setTitle('Car AI Assistant API DOCS')
    .setDescription('Documentation for the Car AI Assistant API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appSettingsService = app.get(AppSettingsService);
  await appSettingsService.initializeSettings();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  logger.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();
