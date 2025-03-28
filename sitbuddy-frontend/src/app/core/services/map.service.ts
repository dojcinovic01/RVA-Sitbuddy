import { Inject, Injectable } from '@angular/core';
import { Sitter, MarkerData } from '../../features/map/map.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { GeolocationService } from './geolocation.service';
import { take } from 'rxjs';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private defaultCenter: google.maps.LatLngLiteral = { lat: 42.6152875, lng: 22.3984821 };
  private defaultZoom = 12;
  private map: google.maps.Map | null = null;
  private imagesUrl= environment.imageUrl;

  constructor(
    @Inject(Store) private store: Store,
    private geolocationService: GeolocationService,
    private userService: UserService
  ) {
    this.setUserLocationAsDefault();
  }

  ngonInit(): void {
    this.setUserLocationAsDefault();
  }

  private setUserLocationAsDefault(): void {
    this.userService.getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        if (user?.location) {
          this.geolocationService.getCoordinates(user.location)
            .pipe(take(1))
            .subscribe((coords) => {
              if (coords) {
                this.defaultCenter = coords;
                this.updateMapCenter(coords); // ✅ Ažuriramo centar mape
              }
            });
        }
      });
  }

  createMap(container: HTMLElement): google.maps.Map {
    this.map = new google.maps.Map(container, {
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      mapId: 'DEMO_MAP_ID',
    });
    return this.map;
  }

  private updateMapCenter(coords: google.maps.LatLngLiteral): void {
    if (this.map) {
      this.map.setCenter(coords); 
    }
  }

  createMarkers(sitters: Sitter[]): MarkerData[] {
    return sitters
      .filter((sitter) => sitter.latitude && sitter.longitude)
      .map((sitter) => ({
        id: sitter.id,
        position: new google.maps.LatLng(sitter.latitude!, sitter.longitude!),
        title: sitter.fullName,
        profilePicture: sitter.profilePicture || '',
        averageRating: sitter.averageRating,
      }));
  }

  addAdvancedMarkers(
    map: google.maps.Map,
    markers: MarkerData[],
    onClick: (id: number) => void
  ): void {
    if (!map || !google.maps.marker || !google.maps.marker.AdvancedMarkerElement) {
      console.error('Google Maps API nije pravilno učitan.');
      return;
    }

    markers.forEach((markerData) => {
      new google.maps.marker.AdvancedMarkerElement({
        position: markerData.position,
        map: map,
        content: this.createMarkerContent(markerData, onClick),
      });
    });
  }

  private createMarkerContent(markerData: MarkerData, onClick: (id: number) => void): HTMLElement {
    const profilePictureUrl = markerData.profilePicture
      ? `${this.imagesUrl}/profile-pictures/${markerData.profilePicture}`
      : null;

    const defaultIcon = `<span style="font-size: 40px;">👤</span>`;
    const div = document.createElement('div');
    div.className = 'custom-marker';
    div.innerHTML = `
      <div class="marker-container" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 3px;">
        ${
          profilePictureUrl
            ? `<img src="${profilePictureUrl}" 
                alt="${markerData.title}" 
                class="marker-image" 
                style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);">`
            : defaultIcon
        }
        <span class="marker-title" style="font-size: 14px; font-weight: bold; color: #333; text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);">
          ${markerData.title}
        </span>
        <span class="marker-rating" style="font-size: 14px; color:rgb(0, 0, 0); font-weight: bold;">
          ⭐ ${markerData.averageRating ? markerData.averageRating.toFixed(1) : 'N/A'}
        </span>
      </div>
    `;

    div.addEventListener('click', () => onClick(markerData.id));
    return div;
}

}
