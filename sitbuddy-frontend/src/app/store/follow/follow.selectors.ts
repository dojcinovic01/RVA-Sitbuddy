import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FollowState } from './follow.state';

export const selectFollowState = createFeatureSelector<FollowState>('follow');

export const selectFollowing = createSelector(selectFollowState, (state) => state.following);
export const selectFollowers = createSelector(selectFollowState, (state) => state.followers);
export const selectFollowLoading = createSelector(selectFollowState, (state) => state.loading);
export const selectFollowError = createSelector(selectFollowState, (state) => state.error);