export interface Advertisment {
    id: number;
    title: string;
    description: string;
    adFromId: number;
}
  
export interface AdvertismentState {
    advertisments: Advertisment[];
    userAdvertisment: Advertisment | null;
    loading: boolean;
    error: string | null;
}
  