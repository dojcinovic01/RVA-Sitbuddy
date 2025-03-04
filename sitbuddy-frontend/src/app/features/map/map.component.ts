import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GeolocationService } from '../../core/services/map.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { profile } from 'console';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, NavbarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) mapComponent!: GoogleMap;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  siters: any[] = [];
  center: google.maps.LatLngLiteral = { lat: 42.6152875, lng: 22.3984821 };
  zoom = 12;
  markers: any[] = [];
  map!: google.maps.Map;

  constructor(private geolocationService: GeolocationService,  private router: Router,  private zone: NgZone) {}

  ngOnInit(): void {
    console.log('Inicijalizacija komponente...');
  }

  ngAfterViewInit(): void {
    this.waitForGoogleMaps().then(() => {
      console.log('Google Maps API učitan.');
      this.initMap();
      this.loadSitters();
    }).catch(error => console.error('Greška pri učitavanju Google Maps:', error));
  }

  private waitForGoogleMaps(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps && google.maps.marker) {
        resolve();
        return;
      }
  
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.addEventListener('load', () => {
          if (window.google && window.google.maps && google.maps.marker) {
            resolve();
          } else {
            reject('Google Maps API nije pravilno učitan.');
          }
        });
      } else {
        reject('Google Maps skripta nije pronađena u DOM-u.');
      }
    });
  }
  

  private initMap(): void {
    if (!this.mapContainer.nativeElement) {
      console.error('Element za mapu nije pronađen.');
      return;
    }
  
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      mapId: 'DEMO_MAP_ID' // Možeš dodati custom Map ID ako koristiš Google Cloud Console
    });
  }
  

  private loadSitters(): void {
    this.geolocationService.getSittersWithCoordinates().subscribe(
      (siters) => {
        console.log('Sitters:', siters);
        this.siters = siters;

        this.markers = siters
        .filter((siter) => siter.latitude && siter.longitude)
        .map((siter) => ({
            id: siter.id,
            position: new google.maps.LatLng(siter.latitude, siter.longitude),
            title: siter.fullName,
            profilePicture: siter.profilePicture ? siter.profilePicture : 'default-profile.jpg',
        }));


        console.log('Markeri:', this.markers);
        this.addAdvancedMarkers();
      },
      (error) => {
        console.error('Greška pri dobijanju sitera:', error);
      }
    );
  }

  private addAdvancedMarkers(): void {
    if (!this.map || !google.maps.marker || !google.maps.marker.AdvancedMarkerElement) {
      console.error('Google Maps API nije pravilno učitana.');
      return;
    }
  
    this.markers.forEach((markerData) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: markerData.position,
        map: this.map,
        content: this.createMarkerContent(markerData.title, markerData.profilePicture, markerData.id), 
      });
  
      
    });
  }
  

// Kreira prilagođeni sadržaj za marker
private createMarkerContent(title: string, profilePicture: string, id:number): HTMLElement {
    const div = document.createElement('div');
    div.className = 'custom-marker';
  
    div.innerHTML = `
      <div class="marker-container">
        <img src="http://localhost:3000/uploads/profile-pictures/${profilePicture}" 
             alt="${title}" 
             class="marker-image" 
             style="width: 30px; height: 30px; max-width: 30px; max-height: 30px;">
        <span class="marker-title">${title}</span>

      </div>
    `;
    
    div.addEventListener("click", () => {
        console.log(`Kliknut marker za korisnika ID: ${id}`);
        this.zone.run(() => {
          this.router.navigate(['/profile', id]);
        });
      });
    return div;
}


  

}
