import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';
import { AdvertismentModule } from './advertisment/advertisment.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Omogućava pristup iz svih modula
    }),
    AuthModule,
    FollowModule,
    AdvertismentModule,
    ReviewModule,
    UserModule,
    ReportModule,

    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "myuser", // Zameni sa korisničkim imenom koje si koristio prilikom kreiranja Docker kontejnera
      password: "mypassword", // Zameni sa lozinkom koju si definisao
      database: "mydatabase", // Naziv baze koju si definisao u Docker komandi
      autoLoadEntities: true, // Automatsko učitavanje entiteta
      synchronize: true, // Automatsko kreiranje tabela (koristi samo u razvoju!)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
