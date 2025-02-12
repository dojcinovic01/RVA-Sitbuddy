import { createReducer, on } from '@ngrx/store';
import { loadUserSuccess, loadUserFailure, updateUserSuccess, updateUserFailure, deleteUserSuccess } from './user.actions';
import { initialUserState, UserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,
  on(loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(loadUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(updateUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(deleteUserSuccess, ()=> initialUserState),  
);
