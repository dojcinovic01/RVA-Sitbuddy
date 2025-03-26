import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';

@Controller("reviews")
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post("write")
    async writeReview(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto);
    }

    @Get("allReviews")
    async getAllReviews() {
        return this.reviewService.findAll();
    }

    @Get("user/:id")
    async getReviewsForUser(@Param("id") id: number) {
        return this.reviewService.findForUser(id);
    }

    @Delete(":id")
    async deleteReview(@Param("id") id: number, @Query("userId") userId?: number) {
        return this.reviewService.delete(id, userId ? Number(userId) : undefined);
    }

    @Patch(":id")
    async updateReview(@Param("id") id: number, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.update(id, updateReviewDto);
    }
}
