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

  constructor(private http: HttpClient) {
    //console.log('AuthService initialized');
  }

  
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
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    if(typeof localStorage  !== 'undefined') {
    return localStorage.getItem('token');
   }
   return null;
  }

  saveAuthData(user: any, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  getUser(): any | null {
    if(typeof localStorage  !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
    }
    return null;
  }

  register(
    fullName: string, 
    email: string, 
    password: string, 
    location: string, 
    phoneNumber: string, 
    userType: 'parent' | 'sitter'
  ): Observable<{ user: any; token: string }> {
    console.log('AuthService.register:', fullName, email, password, location, phoneNumber, userType);
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
