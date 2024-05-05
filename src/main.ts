/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { INestApplication, LoggerService } from '@nestjs/common';

async function bootstrap() {
  const logger: LoggerService = WinstonModule.createLogger(winstonConfig);
  const app: INestApplication = await NestFactory.create(AppModule, { logger });
  await app.listen(3000);
}
bootstrap();
