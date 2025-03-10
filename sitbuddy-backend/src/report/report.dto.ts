import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReportType } from './report.entity';

export class CreateReportDto {
  @IsOptional()
  @IsNumber()
  reportedById: number;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsNumber()
  reportedUserId?: number;

  @IsOptional()
  @IsNumber()
  reportedAdvertismentId?: number;

  @IsOptional()
  @IsNumber()
  reportedReviewId?: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
