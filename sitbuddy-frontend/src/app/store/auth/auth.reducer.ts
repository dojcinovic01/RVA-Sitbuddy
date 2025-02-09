import { createReducer, on } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';

export const authReducer = createReducer<AuthState>(
  initialAuthState,
  on(login, state => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { token }) => ({ ...state, token, loading: false })),
  on(loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(logout, () => initialAuthState)
);