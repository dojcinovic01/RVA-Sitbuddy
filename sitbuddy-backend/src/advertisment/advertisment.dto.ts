import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAdvertismentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  adFromId: number;
}

export class UpdateAdvertismentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}