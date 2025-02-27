import { createReducer, on } from '@ngrx/store';
import { loadUserSuccess, loadUserFailure, updateUserSuccess, updateUserFailure, deleteUserSuccess, searchUsersSuccess, searchUsersFailure } from './user.actions';
import { initialUserState, UserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,
  on(loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(loadUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(updateUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(deleteUserSuccess, ()=> initialUserState),  
  on(searchUsersSuccess, (state, { users }) =>({ ...state, searchResults: users, loading: false, error: null })),
  on(searchUsersFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
