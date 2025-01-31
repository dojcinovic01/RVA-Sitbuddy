import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';

@Controller("reviews")
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    // Endpoint za kreiranje recenzije
    @Post("write")
    async writeReview (@Body () createReviewDto : CreateReviewDto){
        return this.reviewService.create(createReviewDto);
    }

    @Get("allReviews")
    async getAllReviews(){
        return this.reviewService.findAll();
    }

    @Delete(":id")
    async deleteReview(@Param("id") id: number){
        return this.reviewService.delete(id);
    }
    
    @Patch(":id")
    async updateReview(@Param("id") id: number, @Body() updateReviewDto: UpdateReviewDto){
        return this.reviewService.update(id, updateReviewDto);
    }
}
