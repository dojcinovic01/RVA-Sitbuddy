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
 
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors(); // Omogućavamo CORS
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
