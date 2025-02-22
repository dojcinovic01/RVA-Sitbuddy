import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { userReducer } from './user/user.reducer';
import { advertismentReducer } from './advertisment/advertisment.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  advertisment: advertismentReducer,
};
