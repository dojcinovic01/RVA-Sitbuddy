
import { Injectable, NotFoundException } from '@nestjs/common';
import { Advertisment } from './advertisment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateAdvertismentDto, UpdateAdvertismentDto } from './advertisment.dto';

@Injectable()
export class AdvertismentService {
    constructor(
            @InjectRepository(Advertisment)
            private advertismentRepository: Repository<Advertisment>,
            private userService: UserService
    ) {}

    async create(advertismentDto: CreateAdvertismentDto): Promise<Advertisment> {
        const { title, description, adFromId } = advertismentDto;
        const adFrom = await this.userService.findById(adFromId);

        const ad = this.advertismentRepository.create({title, description, adFrom});
        return this.advertismentRepository.save(ad);
    }

    async findAll(): Promise<Advertisment[]> {
        return this.advertismentRepository.find();
    }

    async findById(id: number): Promise<Advertisment> {
        const advertisment= this.advertismentRepository.findOne({where:{id}});
        if (!advertisment) {
            throw new NotFoundException("Advertisment not found.");
        }
        return advertisment;
    }

    async update(id: number, advertismentDto: UpdateAdvertismentDto): Promise<Advertisment> {
        const { title, description} = advertismentDto;
        
        const ad = await this.findById(id);
        ad.title = title;
        ad.description = description;

        return this.advertismentRepository.save(ad);
    }

    async delete(id: number): Promise<string> {
        const ad= await this.findById(id);
    
        await this.advertismentRepository.delete(id);
        return `Advertisment with id: ${id} deleted successfully.`;
    }

}
