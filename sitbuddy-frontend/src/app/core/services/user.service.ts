import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // Prilagodi prema backendu

  constructor(private http: HttpClient) {}

  // Dobavljanje podataka korisnika
  getUser(userId: string): Observable<any> {
    console.log('Dobavljanje korisnika:', userId);
    
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      tap(response => console.log('Dobavljeni korisnik:', response)) // Ovde se ispisuje odgovor servera
    );
  }
  

  // Ažuriranje korisnika
  updateUser(userId: string, userData: Partial<any>): Observable<any> {
    console.log('Ažuriranje korisnika:',userId, userData);
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, userData);
  }
}
