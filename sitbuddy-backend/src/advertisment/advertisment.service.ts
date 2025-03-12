
import { Injectable, NotFoundException } from '@nestjs/common';
import { Advertisment } from './advertisment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateAdvertismentDto, UpdateAdvertismentDto } from './advertisment.dto';
import { ReviewService } from 'src/review/review.service';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class AdvertismentService {
    constructor(
            @InjectRepository(Advertisment)
            private advertismentRepository: Repository<Advertisment>,
            private userService: UserService,
            private reviewService: ReviewService,
            private followService: FollowService
    ) {}

    async create(advertismentDto: CreateAdvertismentDto): Promise<Advertisment> {
        const { title, description, adFromId } = advertismentDto;
        const adFrom = await this.userService.findById(adFromId);

        const ad = this.advertismentRepository.create({title, description, adFrom});
        return this.advertismentRepository.save(ad);
    }

    async findAll(): Promise<Advertisment[]> {
        const advertisments = await this.advertismentRepository.find({ relations: ['adFrom'] });
    
        for (const ad of advertisments) {
            if (ad.adFrom) {
                ad.adFrom['averageRating'] = await this.userService.calculateAverageRating(ad.adFrom.id);
            }
        }
    
        return advertisments;
    }
    

    async findById(id: number): Promise<Advertisment> {
        const advertisment= this.advertismentRepository.findOne({where:{id}});
        if (!advertisment) {
            throw new NotFoundException("Advertisment not found.");
        }
        return advertisment;
    }


    async findByUserId(id: number): Promise<Advertisment|null> {
        const user = await this.userService.findById(id);
        return this.advertismentRepository.findOne({where:{adFrom: user}});
    }

    async findByFollowedUsers(userId: number): Promise<Advertisment[]> {
        const followedUsers = await this.followService.getFollowing(userId);
        if (!followedUsers.length) return []; 
    
        const advertisments = await this.advertismentRepository.find({
            where: { adFrom: In(followedUsers.map(user => user.id)) },
            relations: ['adFrom'],
        });
    
        for (const ad of advertisments) {
            if (ad.adFrom) {
                ad.adFrom['averageRating'] = await this.userService.calculateAverageRating(ad.adFrom.id);
            }
        }
    
        return advertisments;
    }
    
    

    async findTopRatedAds(): Promise<Advertisment[]> {
        const sitters = await this.userService.getSitters(); // Sad vraća UserWithRating[]
        const sortedSitters = sitters
            .filter(sitter => sitter.advertisment) // Samo oni koji imaju oglas
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    
        const advertisments = sortedSitters.map(sitter => sitter.advertisment);
    
        for (const ad of advertisments) {
            if (ad.adFrom) {
                ad.adFrom['averageRating'] = await this.userService.calculateAverageRating(ad.adFrom.id);
            }
        }
    
        return advertisments;
    }
    
    async findByCriminalRecordProof(): Promise<Advertisment[]> {
        const usersWithProof = await this.userService.findUsersWithCriminalRecordProof();
        if (!usersWithProof.length) return []; // Ako nema korisnika s potvrdom, vrati prazan niz
    
        const advertisments = await this.advertismentRepository.find({
            where: { adFrom: In(usersWithProof.map(user => user.id)) },
            relations: ['adFrom'],
        });
    
        for (const ad of advertisments) {
            if (ad.adFrom) {
                ad.adFrom['averageRating'] = await this.userService.calculateAverageRating(ad.adFrom.id);
            }
        }
    
        return advertisments;
    }
    
    

    async update(id: number, advertismentDto: UpdateAdvertismentDto): Promise<Advertisment> {
        const { title, description} = advertismentDto;
        
        const ad = await this.findById(id);
        ad.title = title;
        ad.description = description;

        return this.advertismentRepository.save(ad);
    }

    async delete(id: number): Promise<{message:string}> {
        const ad= await this.findById(id);
    
        await this.advertismentRepository.delete(id);
        return { message: `Advertisment with id: ${id} deleted successfully.` };
    }

}
