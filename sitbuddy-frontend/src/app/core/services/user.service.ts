import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  // Dobavljanje podataka korisnika po ID-ju
  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      tap(response => console.log('Dobavljeni korisnik:', response))
    );
  }

  // Dobavljanje trenutno prijavljenog korisnika
  getCurrentUser(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Nema tokena, korisnik nije prijavljen');
  }

  let headers = new HttpHeaders();
  headers = headers.set('Authorization', `Bearer ${token}`);

  //console.log('Headers nakon setovanja:', headers.get('Authorization'));
  

  return this.http.get<any>(`${this.apiUrl}/auth/profile`, { headers }).pipe(
   // tap(response => console.log('Trenutni korisnik:', response)),
    catchError(error => {
      console.error('Greška prilikom preuzimanja korisnika:', error);
      return throwError(() => error);
    })
  );
}

  
  updateUser(userId: string, userData: Partial<any>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}`, userData, { headers });
  }

  
  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/upload-profile-picture`, formData);
  }

  uploadCriminalRecord(formData: FormData) {
    return this.http.post(`${this.apiUrl}/users/upload-criminal-record`, formData);
  }
 
  deleteUser(userId:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(
       catchError(error => {
         console.error('Greška prilikom brisanja korisnika:', error);
         return throwError(() => error);
       })
    );
  }
}
