import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Review, User } from '../../store/review/review.state';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { selectReviews } from '../../store/review/review.selectors';
import * as ReviewActions from '../../store/review/review.actions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const DEFAULT_RATING = 5;
const REPORT_DIALOG_WIDTH = '400px';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() reviewedUserId!: string;

  user$: Observable<User | null>;
  reviews$: Observable<Review[]>;
  userReview: Review | null = null;
  isEditing = false;
  editedReview: Partial<Review> = {};
  
  newReview: Omit<Review, 'id'> = {
    comment: '',
    rating: DEFAULT_RATING,
    reviewFrom: {} as User,
    reviewTo: {} as User
  };

  private subscriptions = new Subscription();

  constructor(private store: Store, private dialog: MatDialog) {
    this.user$ = this.store.select(selectUser);
    this.reviews$ = this.store.select(selectReviews);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.user$.subscribe(user => {
        if (user) {
          this.newReview.reviewFrom = user;
          this.loadReviews();
        }
      })
    );

    this.subscriptions.add(
      this.reviews$.subscribe(reviews => {
        if (reviews.length) {
          this.userReview = this.findUserReview(reviews);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private findUserReview(reviews: Review[]): Review | null {
    return reviews.find(review => 
      review.reviewFrom.id === this.newReview.reviewFrom.id
    ) || null;
  }

  loadReviews(): void {
    if (this.reviewedUserId) {
      this.store.dispatch(ReviewActions.loadReviews({ 
        userId: Number(this.reviewedUserId) 
      }));
    }
  }

  submitReview(): void {
    if (this.isValidReview(this.newReview)) {
      const reviewToSubmit = this.createReviewPayload(this.newReview);
      this.store.dispatch(ReviewActions.addReview({ review: reviewToSubmit }));
      this.resetNewReviewForm();
    }
  }

  private isValidReview(review: Partial<Review>): boolean {
    return !!review.comment && !!review.rating;
  }

  private createReviewPayload(review: Omit<Review, 'id'>): any {
    return {
      comment: review.comment,
      rating: Number(review.rating),
      reviewFromId: review.reviewFrom.id,
      reviewToId: Number(this.reviewedUserId),
    };
  }

  private resetNewReviewForm(): void {
    this.newReview = { 
      comment: '', 
      rating: DEFAULT_RATING, 
      reviewFrom: this.newReview.reviewFrom, 
      reviewTo: {} as User 
    };
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.userReview) {
      this.editedReview = { ...this.userReview };
    }
  }

  updateReview(id: number): void {
    if (this.isValidReview(this.editedReview)) {
      this.store.dispatch(ReviewActions.updateReview({ 
        review: { 
          reviewId: id, 
          comment: this.editedReview.comment, 
          rating: Number(this.editedReview.rating) 
        } 
      }));
      this.isEditing = false;
    }
  }

  deleteReview(id: number): void {
    this.store.dispatch(ReviewActions.deleteReview({ 
      reviewId: id, 
      reviewFromId: Number(this.newReview.reviewFrom.id) 
    }));
    this.userReview = null;
  }

  openReportDialog(reviewId: number, event: MouseEvent): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: REPORT_DIALOG_WIDTH,
      data: { type: 'review', reviewId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Prijava recenzije poslana:', result);
      }
    });
  }
}