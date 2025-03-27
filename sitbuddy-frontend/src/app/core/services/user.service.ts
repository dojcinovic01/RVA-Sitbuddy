import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Nema tokena, korisnik nije prijavljen');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Greška:', error);
    return throwError(() => error);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/profile`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(userId: string, userData: Partial<any>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}`, userData, { headers: this.getAuthHeaders() });
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/upload-profile-picture`, formData);
  }

  uploadCriminalRecord(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/upload-criminal-record`, formData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(catchError(this.handleError));
  }

  deleteCriminalProof(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/criminal-record-proof/${userId}`).pipe(catchError(this.handleError));
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/search?q=${query}`);
  }
}
