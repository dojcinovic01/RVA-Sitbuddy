import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './report.dto';
import { Report } from './report.entity';

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

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.reportService.delete(id);
  }
}
