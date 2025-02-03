import { AuthState } from './auth/auth.state';
import { UserState } from './user/user.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
}
