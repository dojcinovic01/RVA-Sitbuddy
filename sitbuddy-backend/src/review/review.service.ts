import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable,NotFoundException  } from '@nestjs/common';
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
            throw new NotFoundException("Korisnici nisu pronadjeni.");
        }
        if(reviewFrom.userType !== 'parent'){
            throw new NotFoundException("Ocene moze davati jedino roditelj.");
        }

        const existingReview = await this.reviewRepository.findOne({ 
            where: { reviewFrom: { id: reviewFromId }, reviewTo: { id: reviewToId } } 
        });
        
        if (existingReview) {
            throw new BadRequestException("Već ste ostavili recenziju za ovog korisnika.");
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

    async findForUser(id: number): Promise<Review[]> {
        return this.reviewRepository.find({where: {reviewTo: {id}}});
    }

    async delete(id: number, userId: number): Promise<void> {
        const review = await this.findById(id);
    
        if (review.reviewFrom.id !== userId) {
            throw new ForbiddenException("Nemate dozvolu da obrišete ovu recenziju.");
        }
    
        await this.reviewRepository.delete(id);
    }
    

    async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.findById(id);
    
        if (updateReviewDto.comment) {
            review.comment = updateReviewDto.comment;
        }
        if (updateReviewDto.rating) {
            review.rating = updateReviewDto.rating;
        }
    
        return this.reviewRepository.save(review);
    }
    
    
}
