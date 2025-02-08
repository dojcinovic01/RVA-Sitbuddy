import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { createFileStorageConfig } from '../file-storage.util'; // Import funkcije


@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post("register")
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('Pokušaj registracije:', createUserDto);
      return await this.userService.create(createUserDto);
    } catch (error) {
      console.error('Greška prilikom registracije:', error.message);
      throw error; // NestJS automatski šalje odgovarajući HTTP status code
    }
  }


  @Get('allUsers')
  getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  // @Get(':email')
  // async getUserByEmail(@Param('email') email: string): Promise<User> {
  //   return this.userService.findByEmail(email);
  // }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(Number(id));
  }

  @Patch(':id')
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(Number(id), updateUserDto);
  }


  @Delete(':id')
  async deleteUserById(@Param('id') id:number): Promise<string> {
    return this.userService.delete(id);
  }

  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createFileStorageConfig('../../uploads/profile-pictures'),
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.userService.updateProfilePicture(+userId, file.filename);
  }

  @Post('upload-criminal-record')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createFileStorageConfig('../../uploads/criminal-records'),
    }),
  )
  async uploadCriminalRecord(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.userService.updateCriminalRecord(+userId, file.filename);
  }

  @Get('averageRating/:id')
  async getAverageRating(@Param('id') id: number): Promise<number> {
    return this.userService.calculateAverageRating(id);
  }
}
