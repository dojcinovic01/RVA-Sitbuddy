
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdvertismentService } from './advertisment.service';
import { CreateAdvertismentDto, UpdateAdvertismentDto } from './advertisment.dto';

@Controller("advertisment")
export class AdvertismentController {
    constructor(private readonly advertismentService: AdvertismentService) {}

    @Post("create")
    async createAdvertisment(@Body() createAdvertismentDto: CreateAdvertismentDto){
        return this.advertismentService.create(createAdvertismentDto);
    }

    @Get("allAdvertisments")
    async getAllAdvertisments(){
        return this.advertismentService.findAll();
    }

    @Get("top-rated")
    async getTopRatedAdvertisments() {
        return this.advertismentService.findTopRatedAds();
    }

    @Get("criminal-proof")
    async getCriminalRecordProofAds() {
        return this.advertismentService.findByCriminalRecordProof();
    }

    @Get(":id")
    async getAdvertismentById(@Param("id") id: number){
        return this.advertismentService.findById(id);
    }

    @Get("user/:id")
    async getAdvertismentByUserId(@Param("id") id: number){
        console.log("GETTT",id);
        return this.advertismentService.findByUserId(id);
    }

    @Get("followed/:userId")
    async getFollowedAdvertisments(@Param("userId") userId: number) {
        return this.advertismentService.findByFollowedUsers(userId);
    }

    @Patch(":id")
    async updateAdvertisment(@Param("id") id: number, @Body() updateAdvertismentDto: UpdateAdvertismentDto){
        return this.advertismentService.update(id, updateAdvertismentDto);
    }

    @Delete(":id")
    async deleteAdvertisment(@Param("id") id: number){
        return this.advertismentService.delete(id);
    }
}
