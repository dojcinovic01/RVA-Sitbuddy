import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private apiKey = 'AIzaSyDAAKBF7qjh4fSeu6N9iXzeaOWPelyKrBU';
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  private serverUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<{ lat: number; lng: number } | null> {   
    const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          console.log(location);
          return { lat: location.lat, lng: location.lng };
        }
        return null;
      })
    );
  }

  getSittersWithCoordinates(): Observable<any[]> {
    return this.getSitters().pipe(
      switchMap((sitters) => {
        const sitterObservables = sitters.map((sitter) =>
          this.getCoordinates(sitter.location).pipe(
            map((coords) => ({
              ...sitter,
              latitude: coords?.lat ?? 0, // Ako ne može da pronađe, stavi 0
              longitude: coords?.lng ?? 0,
            }))
          )
        );
        return forkJoin(sitterObservables);
      })
    );
  }

  getSitters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/users/allSitters`);
  }
}