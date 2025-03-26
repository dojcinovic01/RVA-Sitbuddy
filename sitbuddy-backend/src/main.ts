import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const staticAssets = [
    { path: configService.get<string>('PROFILE_PICTURES_PATH'), prefix: '/uploads/profile-pictures' },
    { path: configService.get<string>('CRIMINAL_RECORDS_PATH'), prefix: '/uploads/criminal-records' },
  ];

  staticAssets.forEach(({ path, prefix }) => {
    if (path) {
      app.useStaticAssets(path, { prefix });
      console.log(`Serving static files from: ${path}`);
    }
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
