import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const gmailUser = configService.get<string>('GMAIL_USER');
    const gmailPassword = configService.get<string>('GMAIL_PASS');
    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true za port 465, false za 587
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
        tls: {
            rejectUnauthorized: false, // 🔥 Ignoriše verifikaciju sertifikata
          },
      });
      
  }

  async sendReportNotification(email: string, reportType: string, reason: string) {
    const typeMap = {
        user: 'nalog',
        advertisment: 'oglas',
        review: 'recenzija',
      };
  
      const localizedType = typeMap[reportType] || 'sadržaj';
      const subject = `Upozorenje: Prijavljen(a) ${localizedType}`;
      const text = `Vaš(a) ${localizedType} je prijavljen(a) iz sledećeg razloga: ${reason}. Ukoliko je sadržaj uvredljiv, biće obrisan.`;
  
    await this.transporter.sendMail({
      from: this.configService.get<string>('GMAIL_USER'),
      to: email,
      subject,
      text,
    });
  }
}
