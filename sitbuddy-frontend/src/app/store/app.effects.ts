import { AdvertismentEffects } from './advertisment/advertisment.effects';
import { AuthEffects } from './auth/auth.effects';
import { FollowEffects } from './follow/follow.effects';
import { ReviewEffects } from './review/review.effects';
import { UserEffects } from './user/user.effects';

export const appEffects = [AuthEffects, UserEffects, AdvertismentEffects, ReviewEffects, FollowEffects];
