import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Sitter } from '../../features/map/map.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private apiKey = environment.googleApiKey;
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  private serverUrl = `${environment.apiUrl}`;
  private coordinatesCache = new Map<string, { lat: number; lng: number }>();

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<{ lat: number; lng: number } | null> {
    if (this.coordinatesCache.has(address)) {
      return of(this.coordinatesCache.get(address)!);
    }

    const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    

    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          this.coordinatesCache.set(address, { lat: location.lat, lng: location.lng });
          return { lat: location.lat, lng: location.lng };
        }
        return null;
      })
    );
  }

  getSittersWithCoordinates(): Observable<Sitter[]> {
    return this.getSitters().pipe(
      mergeMap((sitters) =>
        forkJoin(
          sitters.map((sitter) =>
            this.getCoordinates(sitter.location).pipe(
              map((coords) => ({
                ...sitter,
                latitude: coords?.lat ?? 0,
                longitude: coords?.lng ?? 0,
              }))
            )
          )
        )
      )
    );
  }

  getSitters(): Observable<Sitter[]> {
    return this.http.get<Sitter[]>(`${this.serverUrl}/users/allSitters`);
  }
}
