import { AdvertismentState } from './advertisment/advertisment.state';
import { AuthState } from './auth/auth.state';
import { ReviewState } from './review/review.state';
import { UserState } from './user/user.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
  advertisment: AdvertismentState;
  review: ReviewState;
}
