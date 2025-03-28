import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { UserModule } from 'src/user/user.module';
import { AdvertismentModule } from 'src/advertisment/advertisment.module';
import { ReviewModule } from 'src/review/review.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([Report]),
    UserModule,
    AdvertismentModule,
    ReviewModule,
    
  ],
  controllers: [ReportController],
  providers: [ReportService, MailService],
  exports: [ReportService],
})
export class ReportModule {}
