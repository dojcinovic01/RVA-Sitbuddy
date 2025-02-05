import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    console.log('AuthService.login:', email, password);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
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
    name: string, 
    email: string, 
    password: string, 
    location: string, 
    phoneNumber: string, 
    userType: 'parent' | 'babysitter'
  ): Observable<{ user: any; token: string }> {
    return this.http.post<{ user: any; token: string }>('http://localhost:3000/users/register', { 
      name, 
      email, 
      password, 
      location, 
      phoneNumber, 
      userType 
    });
  }
  
  
}
