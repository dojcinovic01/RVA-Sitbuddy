import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ReviewService } from '../../core/services/review.service';
import * as ReviewActions from './review.actions';

@Injectable()
export class ReviewEffects {
    constructor(private actions$: Actions, private reviewService: ReviewService) {}

    private handleError(action: any) {
        return catchError(error => of(action({ error: error.message })));
    }

    loadReviews$ = createEffect(() => this.actions$.pipe(
        ofType(ReviewActions.loadReviews),
        mergeMap(({ userId }) =>
            this.reviewService.getReviewsForUser(userId).pipe(
                map(reviews => ReviewActions.loadReviewsSuccess({ reviews })),
                this.handleError(ReviewActions.loadReviewsFailure)
            )
        )
    ));

    addReview$ = createEffect(() => this.actions$.pipe(
        ofType(ReviewActions.addReview),
        mergeMap(({ review }) =>
            this.reviewService.createReview(review).pipe(
                map(newReview => ReviewActions.addReviewSuccess({ review: newReview })),
                this.handleError(ReviewActions.addReviewFailure)
            )
        )
    ));

    updateReview$ = createEffect(() => this.actions$.pipe(
        ofType(ReviewActions.updateReview),
        mergeMap(({ review }) =>
            this.reviewService.updateReview(review).pipe(
                map(updatedReview => ReviewActions.updateReviewSuccess({ review: updatedReview })),
                this.handleError(ReviewActions.updateReviewFailure)
            )
        )
    ));

    deleteReview$ = createEffect(() => this.actions$.pipe(
        ofType(ReviewActions.deleteReview),
        mergeMap(({ reviewId, reviewFromId }) =>
            this.reviewService.deleteReview(reviewId, reviewFromId).pipe(
                map(() => ReviewActions.deleteReviewSuccess({ id: reviewId })),
                this.handleError(ReviewActions.deleteReviewFailure)
            )
        )
    ));
}