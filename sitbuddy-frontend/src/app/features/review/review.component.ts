import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, User } from '../../store/review/review.state';
import { ReviewService } from '../../core/services/review.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review',
  imports: [CommonModule,  MatIconModule, ReactiveFormsModule,FormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() reviewedUserId!: number; // ID korisnika kojem ostavljamo recenziju
  user$: Observable<any>;
  reviews$: Observable<Review[]>;
  newReview: Omit<Review, 'id'> = { comment: '', rating: 5, reviewFrom: {} as User, reviewTo: {} as User };

  constructor(private reviewService: ReviewService, private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.reviews$ = new Observable<Review[]>();
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.newReview.reviewFrom = user;
        this.loadReviews();
      }
    });
  }

  loadReviews() {
    this.reviews$ = this.reviewService.getReviewsForUser(this.reviewedUserId);
  }

  submitReview() {
    if (this.newReview.comment && this.newReview.rating) {
      this.newReview.reviewTo = { id: this.reviewedUserId } as any;
      this.reviewService.createReview(this.newReview).subscribe(() => {
        this.loadReviews();
        this.newReview.comment = '';
        this.newReview.rating = 5;
      });
    }
  }

  deleteReview(id: number) {
    this.user$.subscribe(user => {
      if (user) {
        this.reviewService.deleteReview(id, user.id).subscribe(() => this.loadReviews());
      }
    });
  }
}
