import { forwardRef, Inject, Injectable,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from './review.entity';
import { User } from '../user/user.entity';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';
import { UserService } from 'src/user/user.service';
import { Console } from 'console';


@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
         @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) {}
    
    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const { comment, rating, reviewFromId, reviewToId} = createReviewDto;
        
        const reviewFrom= await this.userService.findById(reviewFromId);
        const reviewTo= await this.userService.findById(reviewToId);

        if (!reviewFrom || !reviewTo) {
            throw new NotFoundException("One or both users not found.");
        }

        const review = this.reviewRepository.create({comment, rating, reviewFrom, reviewTo});
        return this.reviewRepository.save(review);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find();
    }

    async findById(id: number): Promise<Review> {
        const review= await this.reviewRepository.findOne({where: {id}});
        if(!review){
            throw new NotFoundException("Review not found.");
        }
        return review;
    }

    async findByReviewToId(id: number): Promise<Review[]> {
        return this.reviewRepository.find({where: {reviewTo: {id}}});
    }

    async findByReviewFromId(id: number): Promise<Review[]> {
        return this.reviewRepository.find({where: {reviewFrom: {id}}});
    }

    async delete(id: number): Promise<void> {
        await this.findById(id); 
        await this.reviewRepository.delete(id); 
    }

    async update(id: number, updateReviewDto : UpdateReviewDto): Promise<Review> {
        const review = await this.findById(id);
        const {comment} = updateReviewDto;
        review.comment = comment;
        return this.reviewRepository.save(review);
    }
    
}
