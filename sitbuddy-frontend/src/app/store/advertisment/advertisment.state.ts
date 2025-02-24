export interface User {
    id: number;
    fullName: string;
    email: string;
    profilePicture: string;
    userType: "parent" | "sitter";
}

export interface Advertisment {
    id: number;
    title: string;
    description: string;
    adFrom?: User|null; // Dodaj ovaj property
}

  
export interface AdvertismentState {
    advertisments: Advertisment[];
    userAdvertisment: Advertisment | null;
    loading: boolean;
    error: string | null;
}
  