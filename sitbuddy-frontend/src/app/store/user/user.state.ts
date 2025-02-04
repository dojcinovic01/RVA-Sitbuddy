export interface UserState {
    user: any | null;
    loading: boolean;
    error: string | null;
  }
  
  export const initialUserState: UserState = {
    user: null,
    loading: false,
    error: null,
  };
  