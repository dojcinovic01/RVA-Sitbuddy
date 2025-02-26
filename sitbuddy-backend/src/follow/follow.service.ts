import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    private userService: UserService,
  ) {}

  async followUser(followerId: number, followingId: number): Promise<{message:string}> {
    const follower = await this.userService.findById(followerId);
    const following = await this.userService.findById(followingId);

    const existingFollow = await this.followRepository.findOneBy({
      follower: { id: followerId },
      following: { id: followingId },
    });
    
    if (existingFollow) {
      return {message: 'Već pratite ovog korisnika.'};
    }

    const follow = this.followRepository.create({ follower, following });
    await this.followRepository.save(follow);

    return {message:`Korisnik ${follower.fullName} sada prati: ${following.fullName}.`};
  }

  async unfollowUser(followerId: number, followingId: number): Promise<{message:string}> {
    const result = await this.followRepository.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });
    
    if (result.affected === 0) {
      throw new NotFoundException('Ne pratite ovog korisnika.');
    }
    
    return {message: `Uspešno ste otpratili korisnika.`};
  }

  async getFollowing(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'], // Učitavanje korisnika koje korisnik prati
    });

    return follows.map((follow) => follow.following);
  }

  async isFollowing(userId: number, profileId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({where: {follower: {id: userId}, following: {id: profileId}}});
    return !!follow;
  }

  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'], // Učitavanje korisnika koji prate korisnika
    });

    return follows.map((follow) => follow.follower);
  }
}
