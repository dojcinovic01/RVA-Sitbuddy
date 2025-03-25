import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, IsNull, Like, Not, Repository } from "typeorm";
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

  
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
  
      return await this.userRepository.save(user);
  
    } catch (error) {
      // ✅ Loguj nepoznate greške radi lakšeg debugovanja
      console.error('Greška prilikom kreiranja korisnika:', error);
  
      // ✅ Generička greška za ostale slučajeve
      throw new InternalServerErrorException('Došlo je do greške prilikom registracije. Pokušajte ponovo.');
    }
  }
  

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    console.log('Pronađeni korisnici:', users);
    return users;
  }

  async getSitters(): Promise<UserWithRating[]> {
    const sitters = await this.userRepository.find({ 
        where: { userType: UserType.SITTER },
        relations: ["advertisment"] // Učitaj povezane oglase
    });

    const sittersWithRatings: UserWithRating[] = await Promise.all(
        sitters.map(async (sitter) => {
            const averageRating = await this.calculateAverageRating(sitter.id);
            return { ...sitter, averageRating };
        })
    );

    return sittersWithRatings;
}


async findUsersWithCriminalRecordProof(): Promise<User[]> {
   const users= await this.userRepository.find({ where: { criminalRecordProof: Not(IsNull()) } });
   console.log("KORSINICI", users);
   return users;
}


  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } }); // Tražimo korisnika po email-u
    if (!user) {
      throw new NotFoundException(`Korisnik sa email-om ${email} nije pronađen.`);
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Korisnik sa id ${id} nije pronađen.`);
    }
    console.log('Pokušaj pronalaska korisnika:', user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    console.log('Pokušaj ažuriranja korisnika:', updateUserDto);
    const user = await this.findById(id);
  
    if(updateUserDto.oldPassword){
      const isPasswordValid = await bcrypt.compare(updateUserDto.oldPassword, user.password);
      if (!isPasswordValid) {
        console.log('Stara lozinka nije ispravna.');
        throw new ConflictException('Stara lozinka nije ispravna.');
      }
    }
    
    const hashedPassword = updateUserDto.newPassword ? await bcrypt.hash(updateUserDto.newPassword, 10) : user.password;
  
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

    if (!existsSync(filePath)) {
        console.error("❌ Fajl ne postoji:", filePath);
        return false;
    }

    console.log("🔍 OCR analiza fajla:", filePath);

    try {
        const { data } = await Tesseract.recognize(filePath, 'srp', {
            logger: (m) => console.log(m), // Log progres OCR-a
        });

        const extractedText = data.text.toLowerCase();
        console.log("📜 Izvučen tekst:", extractedText);

        // Proveravamo ključne fraze
        const valid = extractedText.includes("није покренут кривични поступак") || extractedText.includes("није покренута истрага");

        if (!valid) {
            console.error("⚠️ Dokument nije validan: ne sadrži ključne fraze.");
        }

        return valid;
    } catch (error) {
        console.error("❌ Greška pri OCR analizi:", error);
        return false;
    }
}

async updateCriminalRecord(userId: number, filename: string): Promise<User> {
  const isValid = await this.analyzeCriminalRecord(filename);
  
  if (!isValid) {
      throw new BadRequestException("❌ Uverenje nije validno! Molimo Vas da pokušate ponovo sa ispravnim dokumentom.");
  }

  const user = await this.findById(userId);
  user.criminalRecordProof = filename;
  return this.userRepository.save(user);
}

  async deleteCriminalProof(userId: number): Promise<User> {
    console.log('Pokušaj brisanja slike potvrde:', userId);
    const user = await this.findById(userId);
    user.criminalRecordProof = null;
    return this.userRepository.save(user);
  }

  async calculateAverageRating(userId: number): Promise<number> {
    const reviews = await this.reviewService.findByReviewToId(userId);
    
    const ratings = reviews.map(review => review.rating);
    const average = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
    
    return parseFloat(average.toFixed(2));
    
  }
  
  async searchUsers(query: string): Promise<User[]> {
   
    const users = await this.userRepository.find({
      where: [
        { fullName: ILike(`%${query}%`) },
        { location: ILike(`%${query}%`) }

      ]
    });
    return users;
  }
  
}
