import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsNumber()
  @IsNotEmpty()
  reviewFromId: number;

  @IsNumber()
  @IsNotEmpty()
  reviewToId: number;
}

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;
}
