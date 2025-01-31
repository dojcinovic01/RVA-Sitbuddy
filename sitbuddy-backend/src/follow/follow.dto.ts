import { IsInt } from 'class-validator';

export class CreateFollowDto {
  @IsInt()
  followerId: number; // ID korisnika koji prati

  @IsInt()
  followingId: number; // ID korisnika koji je praćen
}
