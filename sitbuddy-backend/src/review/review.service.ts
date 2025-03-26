import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from './review.entity';
import { UserService } from 'src/user/user.service';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    async create({ comment, rating, reviewFromId, reviewToId }: CreateReviewDto): Promise<Review> {
        const [reviewFrom, reviewTo] = await Promise.all([
            this.userService.findById(reviewFromId),
            this.userService.findById(reviewToId),
        ]);

        if (!reviewFrom || !reviewTo) throw new NotFoundException("Korisnici nisu pronađeni.");
        if (reviewFrom.userType !== 'parent') throw new NotFoundException("Ocene može davati jedino roditelj.");

        const existingReview = await this.reviewRepository.findOne({
            where: { reviewFrom: { id: reviewFromId }, reviewTo: { id: reviewToId } },
        });

        if (existingReview) throw new BadRequestException("Već ste ostavili recenziju za ovog korisnika.");

        const review = this.reviewRepository.create({ comment, rating, reviewFrom, reviewTo });
        return this.reviewRepository.save(review);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find();
    }

    async findById(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) throw new NotFoundException("Recenzija nije pronađena.");
        return review;
    }

    async findByReviewToId(id: number): Promise<Review[]> {
        return this.reviewRepository.find({ where: { reviewTo: { id } } });
    }

    async findByReviewFromId(id: number): Promise<Review[]> {
        return this.reviewRepository.find({ where: { reviewFrom: { id } } });
    }

    async findForUser(id: number): Promise<Review[]> {
        return this.findByReviewToId(id);
    }

    async delete(id: number, userId?: number): Promise<void> {
        const review = await this.findById(id);
        if (userId && review.reviewFrom.id !== userId) {
            throw new ForbiddenException("Nemate dozvolu da obrišete ovu recenziju.");
        }
        await this.reviewRepository.delete(id);
    }

    async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.findById(id);
        Object.assign(review, updateReviewDto);
        return this.reviewRepository.save(review);
    }
}
