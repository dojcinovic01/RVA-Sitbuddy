import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { createFileStorageConfig } from "../file-storage.util";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Pokušaj registracije:', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get('allUsers')
  getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('allSitters')
  getAllSitters(): Promise<User[]> {
    return this.userService.getSitters();
  }

  @Get('search')
  searchUsers(@Query('q') query: string): Promise<User[]> {
    return this.userService.searchUsers(query);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(Number(id));
  }

  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.delete(id);
  }

  @Post('upload-profile-picture')
  @UseInterceptors(FileInterceptor('file', { storage: createFileStorageConfig('../../uploads/profile-pictures') }))
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
    return this.userService.updateProfilePicture(+userId, file.filename);
  }

  @Post('upload-criminal-record')
  @UseInterceptors(FileInterceptor('file', { storage: createFileStorageConfig('../../uploads/criminal-records') }))
  uploadCriminalRecord(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
    return this.userService.updateCriminalRecord(+userId, file.filename);
  }

  @Delete('criminal-record-proof/:id')
  deleteCriminalProof(@Param('id') id: number): Promise<User> {
    return this.userService.deleteCriminalProof(id);
  }

  @Get('averageRating/:id')
  getAverageRating(@Param('id') id: number): Promise<number> {
    return this.userService.calculateAverageRating(id);
  }
}