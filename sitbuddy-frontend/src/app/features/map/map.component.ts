import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from '../../core/services/google-maps.service';  // Importuj servis
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GeolocationService } from '../../core/services/geolocation.service';
import { MapService } from '../../core/services/map.service';
import { Sitter, MarkerData } from './map.model';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, NavbarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  sitters: Sitter[] = [];
  markers: MarkerData[] = [];
  map!: google.maps.Map;

  constructor(
    private googleMapsService: GoogleMapsService, // Dodaj servis
    private geolocationService: GeolocationService,
    private mapService: MapService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // Prvo učitaj Google Maps API
    this.googleMapsService.loadGoogleMapsApi().then(() => {
      console.log('Google Maps API je uspešno učitan!');
      this.loadSitters(); // Nakon toga učitaj sittere
    }).catch((error) => {
      console.error('Greška pri učitavanju Google Maps API:', error);
    });
  }

  private loadSitters(): void {
    this.geolocationService.getSittersWithCoordinates().subscribe(
      (sitters) => {
        this.sitters = sitters;
        this.markers = this.mapService.createMarkers(sitters);

        // console.log('Sitters WITH CORORDINATES:', this.sitters);
        // console.log('Markers:', this.markers);

        if (this.mapContainer) {
          this.map = this.mapService.createMap(this.mapContainer.nativeElement);
          this.mapService.addAdvancedMarkers(this.map, this.markers, (id) => this.navigateToProfile(id));
        }
      },
      (error) => console.error('Greška pri dobijanju sitera:', error)
    );
  }

  private navigateToProfile(id: number): void {
    this.zone.run(() => {
      this.router.navigate(['/profile', id]);
    });
  }
}
