import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../../store/review/review.state';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/reviews`;
    constructor(private http: HttpClient) {}

    createReview(review: Omit<Review, 'id' | 'reviewFrom' | 'reviewTo'> & { reviewFromId: number; reviewToId: number }): Observable<Review> {
        return this.http.post<Review>(`${this.apiUrl}/write`, review);
    }

    getReviewsForUser(userId: number): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
    }

    updateReview(review: Partial<Review> & { reviewId: number }): Observable<Review> {
        return this.http.patch<Review>(`${this.apiUrl}/${review.reviewId}`, review);
    }

    deleteReview(id: number, userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
    }
}