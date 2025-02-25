import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ReviewService } from '../../core/services/review.service';
import * as ReviewActions from './review.actions';

@Injectable()
export class ReviewEffects {
    constructor(private actions$: Actions, private reviewService: ReviewService) {}

    loadReviews$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReviewActions.loadReviews),
            mergeMap((action) =>
                this.reviewService.getReviewsForUser(action.userId).pipe(
                    map((reviews) => ReviewActions.loadReviewsSuccess({ reviews })),
                    catchError((error) => of(ReviewActions.loadReviewsFailure({ error: error.message })))
                )
            )
        )
    );

    addReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReviewActions.addReview),
            mergeMap(({ review }) =>
                this.reviewService.createReview(review).pipe(
                    map((newReview) => ReviewActions.addReviewSuccess({ review: newReview })),
                    catchError((error) => of(ReviewActions.addReviewFailure({ error: error.message })))
                )
            )
        )
    );
    
    updateReview$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewActions.updateReview),
            mergeMap(({review}) =>
                this.reviewService.updateReview(review).pipe(
                    map((updatedReview) => ReviewActions.updateReviewSuccess({ review: updatedReview })),
                    catchError((error) => of(ReviewActions.updateReviewFailure({ error: error.message })))
                )
            )
        )
    );

    deleteReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReviewActions.deleteReview),
            mergeMap((action) =>
                this.reviewService.deleteReview(action.reviewId, action.reviewFromId).pipe(
                    map(() => ReviewActions.deleteReviewSuccess({ id: action.reviewId })),
                    catchError((error) => of(ReviewActions.deleteReviewFailure({ error: error.message })))
                )
            )
        )
    );
    
}
