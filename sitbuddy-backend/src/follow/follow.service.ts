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

  async followUser(followerId: number, followingId: number): Promise<string> {
    const follower = await this.userService.findById(followerId);
    const following = await this.userService.findById(followingId);

    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      return 'Already following this user.';
    }

    const follow = this.followRepository.create({ follower, following });
    await this.followRepository.save(follow);

    return `User ${follower.name} is now following ${following.name}.`;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<string> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found.');
    }

    await this.followRepository.delete(follow.id);
    return `Successfully unfollowed.`;
  }

  async getFollowing(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'], // Učitavanje korisnika koje korisnik prati
    });

    return follows.map((follow) => follow.following);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'], // Učitavanje korisnika koji prate korisnika
    });

    return follows.map((follow) => follow.follower);
  }
}
