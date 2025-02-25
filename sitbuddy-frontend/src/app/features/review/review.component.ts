import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, User } from '../../store/review/review.state';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { selectReviews } from '../../store/review/review.selectors';
import * as ReviewActions from '../../store/review/review.actions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, RouterModule],
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
    rating: 5,
    reviewFrom: {} as User,
    reviewTo: {} as User
  };

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.reviews$ = this.store.select(selectReviews);
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.newReview.reviewFrom = user;
        this.loadReviews();
      }
    });

    this.reviews$.subscribe(reviews => {
      if (reviews.length) {
        this.userReview = reviews.find(review => review.reviewFrom.id === this.newReview.reviewFrom.id) || null;
      }
    });
  }

  loadReviews() {
    if (this.reviewedUserId) {
      this.store.dispatch(ReviewActions.loadReviews({ userId: Number(this.reviewedUserId) }));
    }
  }

  submitReview() {
    if (this.newReview.comment && this.newReview.rating) {
      const reviewToSubmit = {
        comment: this.newReview.comment,
        rating: Number(this.newReview.rating),
        reviewFromId: this.newReview.reviewFrom.id, // Samo ID, umesto celog objekta
        reviewToId: Number(this.reviewedUserId), // Samo ID, umesto celog objekta
      };
  
      this.store.dispatch(ReviewActions.addReview({ review: reviewToSubmit }));
  
      // Resetujemo formu sa novim objektom
      this.newReview = { comment: '', rating: 5, reviewFrom: this.newReview.reviewFrom, reviewTo: {} as User };
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.userReview) {
      this.editedReview = { ...this.userReview };
    }
  }

  updateReview(id:number) {
    if (this.editedReview.comment && this.editedReview.rating) {
      this.store.dispatch(ReviewActions.updateReview({ review: { reviewId: id, comment: this.editedReview.comment, rating: Number(this.editedReview.rating) } }));
      this.isEditing = false;
    }
  }

  deleteReview(id: number) {
    this.store.dispatch(ReviewActions.deleteReview({ reviewId: id, reviewFromId: Number(this.newReview.reviewFrom.id) }));
    this.userReview = null;
  }
}
