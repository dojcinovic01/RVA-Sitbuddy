import { createAction, props } from '@ngrx/store';
import { Review } from './review.state';

const source = '[Review]';

export const loadReviews = createAction(`${source} Load`, props<{ userId: number }>());
export const loadReviewsSuccess = createAction(`${source} Load Success`, props<{ reviews: Review[] }>());
export const loadReviewsFailure = createAction(`${source} Load Failure`, props<{ error: string }>());

export const addReview = createAction(`${source} Add`, props<{ review: Omit<Review, 'id' | 'reviewFrom' | 'reviewTo'> & { reviewFromId: number; reviewToId: number } }>());
export const addReviewSuccess = createAction(`${source} Add Success`, props<{ review: Review }>());
export const addReviewFailure = createAction(`${source} Add Failure`, props<{ error: string }>());

export const updateReview = createAction(`${source} Update`, props<{ review: Partial<Review> & { reviewId: number } }>());
export const updateReviewSuccess = createAction(`${source} Update Success`, props<{ review: Review }>());
export const updateReviewFailure = createAction(`${source} Update Failure`, props<{ error: string }>());

export const deleteReview = createAction(`${source} Delete`, props<{ reviewId: number; reviewFromId: number }>());
export const deleteReviewSuccess = createAction(`${source} Delete Success`, props<{ id: number }>());
export const deleteReviewFailure = createAction(`${source} Delete Failure`, props<{ error: string }>());
