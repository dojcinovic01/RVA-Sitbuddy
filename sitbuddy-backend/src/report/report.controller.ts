import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report.dto';
import { Report, ReportType } from './report.entity';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportService.create(createReportDto);
  }

  @Get()
  findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Report> {
    return this.reportService.findById(id);
  }

  @Get('type/:type')
  findByType(@Param('type') type: ReportType): Promise<Report[]> {
    return this.reportService.findByType(type);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.reportService.delete(id);
  }

  @Delete(':id/content')
  deleteReportedContent(@Param('id') id: number): Promise<{ message: string }> {
    return this.reportService.deleteReportedContent(id);
  }
}
