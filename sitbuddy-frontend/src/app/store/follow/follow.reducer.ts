import { createReducer, on } from '@ngrx/store';
import {
  followUser,
  followUserSuccess,
  followUserFailure,
  unfollowUser,
  unfollowUserSuccess,
  unfollowUserFailure,
  loadFollowing,
  loadFollowingSuccess,
  loadFollowingFailure,
  loadFollowers,
  loadFollowersSuccess,
  loadFollowersFailure,
} from './follow.actions';
import { initialFollowState, FollowState } from './follow.state';

export const followReducer = createReducer(
  initialFollowState,
  on(followUser, (state) => ({ ...state, loading: true, error: null })),
  on(followUserSuccess, (state, { followingId }) => ({
    ...state,
    loading: false,
    following: [...state.following, { followingId: followingId }]
  })),
  on(followUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(unfollowUser, (state) => ({ ...state, loading: true, error: null })),
  on(unfollowUserSuccess, (state, { followingId }) => ({
    ...state,
    loading: false,
    following: state.following.filter(follow => follow.followingId !== followingId)
  })),
  on(unfollowUserFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadFollowing, (state) => ({ ...state, loading: true })),
  on(loadFollowingSuccess, (state, { following }) => {
    console.log('LOAD FOLLOWING SUCCESS:', following);
    return { ...state, loading: false, following };
  }),
  
  on(loadFollowingFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadFollowers, (state) => ({ ...state, loading: true })),
  on(loadFollowersSuccess, (state, { followers }) => ({ ...state, loading: false, followers })),
  on(loadFollowersFailure, (state, { error }) => ({ ...state, loading: false, error }))
  
);