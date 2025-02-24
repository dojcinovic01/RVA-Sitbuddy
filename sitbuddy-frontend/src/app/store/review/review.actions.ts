import { createAction, props } from '@ngrx/store';
import { Review } from './review.state';

// Učitavanje recenzija za korisnika
export const loadReviews = createAction('[Review] Load Reviews', props<{ userId: number }>());
export const loadReviewsSuccess = createAction('[Review] Load Reviews Success', props<{ reviews: Review[] }>());
export const loadReviewsFailure = createAction('[Review] Load Reviews Failure', props<{ error: string }>());

// Dodavanje recenzije
export const addReview = createAction('[Review] Add Review', props<{ review: Omit<Review, 'id'> }>());
export const addReviewSuccess = createAction('[Review] Add Review Success', props<{ review: Review }>());
export const addReviewFailure = createAction('[Review] Add Review Failure', props<{ error: string }>());

// Ažuriranje recenzije
export const updateReview = createAction('[Review] Update Review', props<{ id: number; review: Partial<Review> }>());
export const updateReviewSuccess = createAction('[Review] Update Review Success', props<{ review: Review }>());
export const updateReviewFailure = createAction('[Review] Update Review Failure', props<{ error: string }>());

// Brisanje recenzije
export const deleteReview = createAction('[Review] Delete Review', props<{ id: number }>());
export const deleteReviewSuccess = createAction('[Review] Delete Review Success', props<{ id: number }>());
export const deleteReviewFailure = createAction('[Review] Delete Review Failure', props<{ error: string }>());
