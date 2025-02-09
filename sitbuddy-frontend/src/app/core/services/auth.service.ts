import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface LoginResponse {
  user: any;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Postavi URL backend API-ja

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(error => {
        alert(error.error?.message || 'Greška prilikom prijave');
        return throwError(() => new Error(error.error?.message || 'Greška prilikom prijave'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }

  saveAuthData(token: string): void {
    localStorage.setItem('token', token);
  }

  register(
    fullName: string, 
    email: string, 
    password: string, 
    location: string, 
    phoneNumber: string, 
    userType: 'parent' | 'sitter'
  ): Observable<{ user: any; token: string }> {
    return this.http.post<{ user: any; token: string }>('http://localhost:3000/users/register', { 
      fullName, 
      email, 
      password, 
      location, 
      phoneNumber, 
      userType 
    });
  }
}