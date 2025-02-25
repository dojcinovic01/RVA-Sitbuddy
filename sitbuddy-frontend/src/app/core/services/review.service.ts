import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../../store/review/review.state';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;  

  constructor(private http: HttpClient) {}

  // Kreiranje recenzije
  createReview(review: { comment: string; rating: number; reviewFromId: number; reviewToId: number }): Observable<Review> {
    console.log('Review sent to backend:', review);
    return this.http.post<Review>(`${this.apiUrl}/write`, review);
}

  // Dohvatanje svih recenzija
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/allReviews`);
  }

  // Dohvatanje recenzija za određenog korisnika (koji je primio recenzije)
  getReviewsForUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Ažuriranje recenzije
  updateReview( review: { reviewId:number; comment: string; rating: number; }): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${review.reviewId}`, review);
  }

  // Brisanje recenzije
  deleteReview(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }

}
