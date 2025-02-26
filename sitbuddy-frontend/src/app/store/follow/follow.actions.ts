import { createAction, props } from '@ngrx/store';

export const followUser = createAction(
  '[Follow] Follow User',
  props<{ followerId: number; followingId: number }>()
);

export const followUserSuccess = createAction(
  '[Follow] Follow User Success',
  props<{ followerId: number, followingId:number }>()
);

export const followUserFailure = createAction(
  '[Follow] Follow User Failure',
  props<{ error: string }>()
);

export const unfollowUser = createAction(
  '[Follow] Unfollow User',
  props<{ followerId: number; followingId: number }>()
);

export const unfollowUserSuccess = createAction(
  '[Follow] Unfollow User Success',
  props<{ followerId: number, followingId:number }>()
);

export const unfollowUserFailure = createAction(
  '[Follow] Unfollow User Failure',
  props<{ error: string }>()
);

export const loadFollowing = createAction(
  '[Follow] Load Following',
  props<{ userId: number }>()
);

export const loadFollowingSuccess = createAction(
  '[Follow] Load Following Success',
  props<{ following: any[] }>()
);

export const loadFollowingFailure = createAction(
  '[Follow] Load Following Failure',
  props<{ error: string }>()
);

export const loadFollowers = createAction(
  '[Follow] Load Followers',
  props<{ userId: number }>()
);

export const loadFollowersSuccess = createAction(
  '[Follow] Load Followers Success',
  props<{ followers: any[] }>()
);

export const loadFollowersFailure = createAction(
  '[Follow] Load Followers Failure',
  props<{ error: string }>()
);
