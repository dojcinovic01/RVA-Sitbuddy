import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, IsNull, Not, Repository } from "typeorm";
import { User, UserType } from "./user.entity";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { ReviewService } from "src/review/review.service";
import * as Tesseract from 'tesseract.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

interface UserWithRating extends User {
  averageRating: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => ReviewService))
    private reviewService: ReviewService,
    private configService: ConfigService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Greška prilikom kreiranja korisnika:', error);
      throw new InternalServerErrorException('Došlo je do greške prilikom registracije. Pokušajte ponovo.');
    }
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getSitters(): Promise<UserWithRating[]> {
    const sitters = await this.userRepository.find({
      where: { userType: UserType.SITTER },
      relations: ["advertisment"]
    });
    return Promise.all(
      sitters.map(async (sitter) => ({
        ...sitter,
        averageRating: await this.calculateAverageRating(sitter.id),
      }))
    );
  }

  async getUsersWithCriminalRecordProof(): Promise<User[]> {
    return this.userRepository.find({ where: { criminalRecordProof: Not(IsNull()) } });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`Korisnik sa email-om ${email} nije pronađen.`);
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Korisnik sa id ${id} nije pronađen.`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (updateUserDto.oldPassword && !(await bcrypt.compare(updateUserDto.oldPassword, user.password))) {
      throw new ConflictException('Stara lozinka nije ispravna.');
    }
    const hashedPassword = updateUserDto.newPassword ? await this.hashPassword(updateUserDto.newPassword) : user.password;
    return this.userRepository.save({ ...user, ...updateUserDto, password: hashedPassword });
  }

  async delete(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return { message: `Korisnik sa id ${id} je uspešno obrisan.` };
  }

  async updateProfilePicture(userId: number, filename: string): Promise<User> {
    const user = await this.findById(userId);
    user.profilePicture = filename;
    return this.userRepository.save(user);
  }

  async analyzeCriminalRecord(filename: string): Promise<boolean> {
    const filePath = join(this.configService.get<string>('CRIMINAL_RECORDS_PATH'), filename);
    if (!existsSync(filePath)) return false;
    try {
      const { data } = await Tesseract.recognize(filePath, 'srp', { logger: (m) => console.log(m) });
      const extractedText = data.text.toLowerCase();
      return extractedText.includes("није покренут кривични поступак") || extractedText.includes("није покренута истрага");
    } catch (error) {
      console.error("Greška pri OCR analizi:", error);
      return false;
    }
  }

  async updateCriminalRecord(userId: number, filename: string): Promise<User> {
    if (!(await this.analyzeCriminalRecord(filename))) {
      throw new BadRequestException("Uverenje nije validno! Molimo Vas da pokušate ponovo sa ispravnim dokumentom.");
    }
    const user = await this.findById(userId);
    user.criminalRecordProof = filename;
    return this.userRepository.save(user);
  }

  async deleteCriminalProof(userId: number): Promise<User> {
    const user = await this.findById(userId);
    user.criminalRecordProof = null;
    return this.userRepository.save(user);
  }

  async calculateAverageRating(userId: number): Promise<number> {
    const reviews = await this.reviewService.findByReviewToId(userId);
    return reviews.length > 0 ? parseFloat((reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length).toFixed(2)) : 0;
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [{ fullName: ILike(`%${query}%`) }, { location: ILike(`%${query}%`) }]
    });
  }
}
