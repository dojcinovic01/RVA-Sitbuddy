import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdvertismentService } from './advertisment.service';
import { CreateAdvertismentDto, UpdateAdvertismentDto } from './advertisment.dto';

@Controller("advertisment")
export class AdvertismentController {
  constructor(private readonly advertismentService: AdvertismentService) {}

  @Post("create")
  createAdvertisment(@Body() dto: CreateAdvertismentDto) {
    return this.advertismentService.create(dto);
  }

  @Get("allAdvertisments")
  getAllAdvertisments() {
    return this.advertismentService.findAll();
  }

  @Get("top-rated")
  getTopRatedAdvertisments() {
    return this.advertismentService.findTopRatedAds();
  }

  @Get("criminal-proof")
  getCriminalRecordProofAds() {
    return this.advertismentService.findByCriminalRecordProof();
  }

  @Get(":id")
  getAdvertismentById(@Param("id") id: number) {
    return this.advertismentService.findById(id);
  }

  @Get("user/:id")
  getAdvertismentByUserId(@Param("id") id: number) {
    return this.advertismentService.findByUserId(id);
  }

  @Get("followed/:userId")
  getFollowedAdvertisments(@Param("userId") userId: number) {
    return this.advertismentService.findByFollowedUsers(userId);
  }

  @Patch(":id")
  updateAdvertisment(@Param("id") id: number, @Body() dto: UpdateAdvertismentDto) {
    return this.advertismentService.update(id, dto);
  }

  @Delete(":id")
  deleteAdvertisment(@Param("id") id: number) {
    return this.advertismentService.delete(id);
  }
}