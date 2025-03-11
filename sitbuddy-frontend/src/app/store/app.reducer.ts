import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { userReducer } from './user/user.reducer';
import { advertismentReducer } from './advertisment/advertisment.reducer';
import { reviewReducer } from './review/review.reducer';
import { followReducer } from './follow/follow.reducer';
import { reportReducer } from './report/report.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  advertisment: advertismentReducer,
  review: reviewReducer,
  follow: followReducer,
  report: reportReducer
};
