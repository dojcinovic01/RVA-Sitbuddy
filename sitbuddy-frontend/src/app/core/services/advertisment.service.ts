import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advertisment } from '../../store/advertisment/advertisment.state';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdvertismentService {
  private readonly apiUrl = `${environment.apiUrl}/advertisment`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Advertisment[]> {
    return this.http.get<Advertisment[]>(`${this.apiUrl}/allAdvertisments`);
  }

  getById(id: number): Observable<Advertisment> {
    return this.http.get<Advertisment>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<Advertisment | null> {
    return this.http.get<Advertisment | null>(`${this.apiUrl}/user/${userId}`);
  }

  getFollowedAdvertisments(userId: number): Observable<Advertisment[]> {
    return this.http.get<Advertisment[]>(`${this.apiUrl}/followed/${userId}`);
  }

  getTopRatedAdvertisments(): Observable<Advertisment[]> {
    return this.http.get<Advertisment[]>(`${this.apiUrl}/top-rated`);
  }

  getCriminalProofAdvertisments(): Observable<Advertisment[]> {
    return this.http.get<Advertisment[]>(`${this.apiUrl}/criminal-proof`);
  }

  create(advertisment: Omit<Advertisment, 'id'>): Observable<Advertisment> {
    return this.http.post<Advertisment>(`${this.apiUrl}/create`, advertisment);
  }

  update(id: number, advertisment: Partial<Advertisment>): Observable<Advertisment> {
    return this.http.patch<Advertisment>(`${this.apiUrl}/${id}`, advertisment);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
