import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ovo omogućava da servis bude dostupan svuda
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/status`);
  }
}
