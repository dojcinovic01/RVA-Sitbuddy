import * as dotenv from 'dotenv';
dotenv.config();

console.log('Dotenv JWT_SECRET:', process.env.JWT_SECRET);

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const uploadsPath = configService.get<string>('PROFILE_PICTURES_PATH');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/profile-pictures',
  });
  
  console.log('Serving static files from:', uploadsPath);

  const criminalRecordsPath = configService.get<string>('CRIMINAL_RECORDS_PATH');

  app.useStaticAssets(criminalRecordsPath, {
    prefix: '/uploads/criminal-records',
  });
  console.log('Serving criminal records from:', criminalRecordsPath);


  app.enableCors(); // Omogućavamo CORS
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
