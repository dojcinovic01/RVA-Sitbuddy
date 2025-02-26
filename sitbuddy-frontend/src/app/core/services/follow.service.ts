import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private apiUrl = `${environment.apiUrl}/follow`;  

  constructor(private http: HttpClient) {}

  followUser(followerId: number, followingId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}`, { followerId, followingId });
  }

  unfollowUser(followerId: number, followingId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${followerId}/${followingId}`);
  }

  getFollowing(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/following/${userId}`);
  }
}
