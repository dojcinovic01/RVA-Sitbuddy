import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { UserService } from 'src/user/user.service';
import { AdvertismentService } from 'src/advertisment/advertisment.service';
import { ReviewService } from 'src/review/review.service';
import { CreateReportDto } from './report.dto';
import { ReportType } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private userService: UserService,
    private advertismentService: AdvertismentService,
    private reviewService: ReviewService
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const { reportedById, type, reportedUserId, reportedAdvertismentId, reportedReviewId, reason } = createReportDto;

    let reportedUser, reportedAdvertisment, reportedReview;

    if (type === ReportType.USER) {
      if (!reportedUserId) throw new BadRequestException('Nedostaje ID prijavljenog korisnika.');
      reportedUser = await this.userService.findById(reportedUserId);
    }

    if (type === ReportType.ADVERTISMENT) {
      if (!reportedAdvertismentId) throw new BadRequestException('Nedostaje ID prijavljenog oglasa.');
      reportedAdvertisment = await this.advertismentService.findById(reportedAdvertismentId);
    }

    if (type === ReportType.REVIEW) {
      if (!reportedReviewId) throw new BadRequestException('Nedostaje ID prijavljene recenzije.');
      reportedReview = await this.reviewService.findById(reportedReviewId);
    }

    const report = this.reportRepository.create({
      reportedUser,
      reportedAdvertisment,
      reportedReview,
      type,
      reason,
    });

    return this.reportRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
  }

  async findById(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException(`Prijava sa ID-jem ${id} nije pronađena.`);
    return report;
  }

  async findByType(type: ReportType): Promise<Report[]> {
    return this.reportRepository.find({ where: { type }, relations: ['reportedUser', 'reportedAdvertisment', 'reportedReview'] });
  }
  
  async delete(id: number): Promise<{ message: string }> {
    const report = await this.findById(id);
    await this.reportRepository.remove(report);
    return { message: `Prijava sa ID-jem ${id} je uspešno obrisana.` };
  }

  async deleteReportedContent(id: number): Promise<{ message: string }> {
    const report = await this.findById(id);
  
    console.log('REPORT->', report);
    if (report.reportedUser) {
      await this.userService.delete(report.reportedUser.id);
    } else if (report.reportedAdvertisment) {
      await this.advertismentService.delete(report.reportedAdvertisment.id);
    } else if (report.reportedReview) {
      await this.reviewService.delete(report.reportedReview.id);
    }
  
    await this.reportRepository.remove(report);
  
    return { message: `Prijava i prijavljeni sadržaj su uspešno obrisani.` };
  }
  
}
