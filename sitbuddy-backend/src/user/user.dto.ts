import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { UserType } from "./user.entity";

export class CreateUserDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @MinLength(6) @IsNotEmpty() password: string;
  @IsOptional() @IsString() profilePicture?: string;
  @IsNotEmpty() @IsString() location: string;
  @IsNotEmpty() @IsString() phoneNumber: string;
  @IsOptional() @IsString() criminalRecordProof?: string; 
  @IsEnum(UserType) @IsNotEmpty() userType?: UserType;
  @IsOptional() @IsNumber() @Min(0) hourlyRate?: number;
}

export class UpdateUserDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(6) oldPassword?: string;
  @IsOptional() @IsString() @MinLength(6) newPassword?: string;
  @IsOptional() @IsString() profilePicture?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() criminalRecordProof?: string;
  @IsOptional() @IsNumber() @Min(0) hourlyRate?: number;
}