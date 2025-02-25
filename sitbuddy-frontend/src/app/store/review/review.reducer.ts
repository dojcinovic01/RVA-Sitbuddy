import { createReducer, on } from '@ngrx/store';
import * as ReviewActions from './review.actions';
import { ReviewState, initialState } from './review.state';

export const reviewReducer = createReducer(
    initialState,

    on(ReviewActions.loadReviews, (state) => ({ ...state, loading: true, error: null })),
    on(ReviewActions.loadReviewsSuccess, (state, { reviews }) => ({ ...state, reviews, loading: false })),
    on(ReviewActions.loadReviewsFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(ReviewActions.addReview, (state) => ({ ...state, loading: true, error: null })),
    on(ReviewActions.addReviewSuccess, (state, { review }) => ({ ...state, reviews: [...state.reviews, review], loading: false })),
    on(ReviewActions.addReviewFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(ReviewActions.updateReview, (state) => ({ ...state, loading: true, error: null })),
    on(ReviewActions.updateReviewSuccess, (state, { review }) => ({
        ...state,
        reviews: state.reviews.map(r => r.id === review.id ? review : r),
        loading: false,
    })),
    on(ReviewActions.updateReviewFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(ReviewActions.deleteReview, (state) => ({ ...state, loading: true, error: null })),
    on(ReviewActions.deleteReviewSuccess, (state, { id }) => ({
        ...state,
        reviews: state.reviews.filter(review => review.id !== id),
        loading: false,
    })),    
    on(ReviewActions.deleteReviewFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
