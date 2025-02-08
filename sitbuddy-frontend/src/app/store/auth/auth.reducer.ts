import { createReducer, on } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';
import { updateUserSuccess } from '../user/user.actions';

export const authReducer = createReducer<AuthState>(
  initialAuthState,
  on(login, state => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user, token }) => {
    return { ...state, user:user, token:token, loading: false };
  }),
  on(loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(logout, state => ({ ...initialAuthState })),
  on(logout, () => initialAuthState),
  on(updateUserSuccess, (state, { user }) => {
    console.log('Ažuriranje korisnika iz AUTH reducer:', user);
    return {
      ...state,
      user, 
      loading: false,
      error: null,
    };
  })
);
