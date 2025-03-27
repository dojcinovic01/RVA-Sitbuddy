import { createAction, props } from '@ngrx/store';

const followAction = (type: string) => createAction(`[Follow] ${type}`, props<{ followerId: number; followingId: number }>());
const followFailureAction = (type: string) => createAction(`[Follow] ${type} Failure`, props<{ error: string }>());

export const followUser = followAction('Follow User');
export const followUserSuccess = followAction('Follow User Success');
export const followUserFailure = followFailureAction('Follow User');

export const unfollowUser = followAction('Unfollow User');
export const unfollowUserSuccess = followAction('Unfollow User Success');
export const unfollowUserFailure = followFailureAction('Unfollow User');

export const loadFollowing = createAction('[Follow] Load Following', props<{ userId: number }>());
export const loadFollowingSuccess = createAction('[Follow] Load Following Success', props<{ following: any[] }>());
export const loadFollowingFailure = followFailureAction('Load Following');

export const loadFollowers = createAction('[Follow] Load Followers', props<{ userId: number }>());
export const loadFollowersSuccess = createAction('[Follow] Load Followers Success', props<{ followers: any[] }>());
export const loadFollowersFailure = followFailureAction('Load Followers');