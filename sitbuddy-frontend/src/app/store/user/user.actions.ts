import { createAction, props } from '@ngrx/store';

export const loadUser = createAction('[User] Load User', props<{ userId: string }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: any }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ userId: string; updatedData: any }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: any }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

export const deleteUser = createAction('[User] Delete User', props<{ userId: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success');
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());

export const searchUsers = createAction('[User] Search Users', props<{ query: string }>());
export const searchUsersSuccess = createAction('[User] Search Users Success', props<{ users: any[] }>());
export const searchUsersFailure = createAction('[User] Search Users Failure', props<{ error: string }>());
