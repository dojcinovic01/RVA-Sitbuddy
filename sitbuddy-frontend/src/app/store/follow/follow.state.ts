export interface FollowState {
    following: any[]; // Lista korisnika koje korisnik prati
    followers: any[]; // Lista korisnika koji prate korisnika
    loading: boolean;
    error: string | null;
  }
  
  export const initialFollowState: FollowState = {
    following: [],
    followers: [],
    loading: false,
    error: null,
  };