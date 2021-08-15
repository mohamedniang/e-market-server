import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(cookieParser());
  await app.listen(3030);
}
bootstrap();
