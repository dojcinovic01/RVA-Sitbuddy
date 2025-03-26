import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './follow.dto';
import { User } from 'src/user/user.entity';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  followUser(@Body() createFollowDto: CreateFollowDto): Promise<{ message: string }> {
    return this.followService.followUser(createFollowDto.followerId, createFollowDto.followingId);
  }

  @Delete(':followerId/:followingId')
  unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ): Promise<{ message: string }> {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: number): Promise<User[]> {
    return this.followService.getFollowing(userId);
  }

  @Get('following/:userId/:profileId')
  isFollowing(
    @Param('userId') userId: number,
    @Param('profileId') profileId: number,
  ): Promise<boolean> {
    return this.followService.isFollowing(userId, profileId);
  }

  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: number): Promise<User[]> {
    return this.followService.getFollowers(userId);
  }
}
