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
    private readonly followRepository: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async followUser(followerId: number, followingId: number): Promise<{ message: string }> {
    const [follower, following, existingCount] = await Promise.all([
      this.userService.findById(followerId),
      this.userService.findById(followingId),
      this.followRepository.count({ where: { follower: { id: followerId }, following: { id: followingId } } }),
    ]);

    if (existingCount > 0) {
      return { message: 'Već pratite ovog korisnika.' };
    }

    await this.followRepository.save(this.followRepository.create({ follower, following }));

    return { message: `Korisnik ${follower.fullName} sada prati: ${following.fullName}.` };
  }

  async unfollowUser(followerId: number, followingId: number): Promise<{ message: string }> {
    const result = await this.followRepository.delete({ follower: { id: followerId }, following: { id: followingId } });

    if (!result.affected) {
      throw new NotFoundException('Ne pratite ovog korisnika.');
    }

    return { message: 'Uspešno ste otpratili korisnika.' };
  }

  async getFollowing(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({ where: { follower: { id: userId } }, relations: ['following'] });
    return follows.map(({ following }) => following);
  }

  async isFollowing(userId: number, profileId: number): Promise<boolean> {
    return !!(await this.followRepository.count({ where: { follower: { id: userId }, following: { id: profileId } } }));
  }

  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({ where: { following: { id: userId } }, relations: ['follower'] });
    return follows.map(({ follower }) => follower);
  }
}
