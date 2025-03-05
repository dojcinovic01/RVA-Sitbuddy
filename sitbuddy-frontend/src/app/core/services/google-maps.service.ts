import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private scriptLoaded = false; // Dodata promenljiva za praćenje statusa učitavanja

  constructor() {}

  loadGoogleMapsApi(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        console.log('Google Maps API je već učitan.');
        resolve(true); // Već učitano, ne dodaj ponovo skriptu
        return;
      }

      // Provera da li je skripta već u <head>
      if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        console.log('Google Maps skripta je već dodata u <head>.');
        this.scriptLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}&libraries=marker&loading=async`;
      script.onload = () => {
        this.scriptLoaded = true;
        console.log('Google Maps API uspešno učitan!');
        resolve(true);
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }
}
