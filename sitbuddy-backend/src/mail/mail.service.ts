import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly gmailUser: string;

  constructor(private configService: ConfigService) {
    this.gmailUser = this.configService.get<string>('GMAIL_USER')!;
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.gmailUser,
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendReportNotification(email: string, reportType: string, reason: string): Promise<void> {
    const typeMap: Record<string, string> = {
      user: 'nalog',
      advertisment: 'oglas',
      review: 'recenzija',
    };

    const localizedType = typeMap[reportType] || 'sadržaj';
    const subject = `Upozorenje: Prijavljen(a) ${localizedType}`;
    const text = `Vaš(a) ${localizedType} je prijavljen(a) iz sledećeg razloga: ${reason}. Ukoliko je sadržaj uvredljiv, biće obrisan.`;

    await this.transporter.sendMail({
      from: this.gmailUser,
      to: email,
      subject,
      text,
    });
  }
}
