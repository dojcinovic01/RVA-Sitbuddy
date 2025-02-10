import * as dotenv from 'dotenv';
dotenv.config();

console.log('Dotenv JWT_SECRET:', process.env.JWT_SECRET);

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadsPath = 'D:/VI semestar/RVA/uploads/profile-pictures';

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/profile-pictures',
  });
  
  console.log('Serving static files from:', uploadsPath);

  const criminalRecordsPath = 'D:/VI semestar/RVA/uploads/criminal-records';

  app.useStaticAssets(criminalRecordsPath, {
    prefix: '/uploads/criminal-records',
  });
  console.log('Serving criminal records from:', criminalRecordsPath);


  app.enableCors(); // Omogućavamo CORS
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
