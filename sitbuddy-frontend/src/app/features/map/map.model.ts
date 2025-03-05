export interface Sitter {
    id: number;
    fullName: string;
    profilePicture?: string;
    location: string;
    latitude?: number;
    longitude?: number;
  }
  
  export interface MarkerData {
    id: number;
    position: google.maps.LatLng;
    title: string;
    profilePicture: string;
  }
  