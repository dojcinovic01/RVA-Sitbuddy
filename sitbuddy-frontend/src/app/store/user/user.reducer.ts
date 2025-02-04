import { createReducer, on } from '@ngrx/store';
import { loadUser, loadUserSuccess, loadUserFailure } from './user.actions';
import { initialUserState, UserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,

  on(loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null,
  })),

  on(loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
