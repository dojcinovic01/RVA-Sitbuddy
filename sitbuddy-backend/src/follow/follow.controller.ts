import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  async followUser(@Body() createFollowDto: CreateFollowDto):Promise<{message:string}> {
    const { followerId, followingId } = createFollowDto;
    return this.followService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ):Promise<{message:string}> {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: number): Promise<any> {
    return this.followService.getFollowing(userId);
  }

  @Get('following/:userId/:profileId')
  async isFollowing(@Param('userId') userId: number, @Param('profileId') profileId: number): Promise<boolean> {
    return this.followService.isFollowing(userId, profileId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: number): Promise<any> {
    return this.followService.getFollowers(userId);
  }
}
