import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report.dto';
import { Report, ReportType } from './report.entity';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportService.create(createReportDto);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Report> {
    return this.reportService.findById(id);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: ReportType): Promise<Report[]> {
    return this.reportService.findByType(type);
  }


  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.reportService.delete(id);
  }

  @Delete(':id/content')
  async deleteReportedContent(@Param('id') id: number): Promise<{ message: string }> {
    return this.reportService.deleteReportedContent(id);
  }

}
