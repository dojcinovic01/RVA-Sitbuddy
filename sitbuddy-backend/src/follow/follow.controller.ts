import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  async followUser(@Body() createFollowDto: CreateFollowDto): Promise<string> {
    const { followerId, followingId } = createFollowDto;
    return this.followService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ): Promise<string> {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: number): Promise<any> {
    return this.followService.getFollowing(userId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: number): Promise<any> {
    return this.followService.getFollowers(userId);
  }
}
