import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewState } from './review.state';

export const selectReviewState = createFeatureSelector<ReviewState>('review');

export const selectReviews = createSelector(selectReviewState, (state) => state.reviews);
export const selectReviewLoading = createSelector(selectReviewState, (state) => state.loading);
export const selectReviewError = createSelector(selectReviewState, (state) => state.error);
