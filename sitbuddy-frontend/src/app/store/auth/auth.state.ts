export interface AuthState {
    user: any | null;
    token: string | null;
    error: string | null;
    loading: boolean;
  }
  
  export const initialAuthState: AuthState = {
    user: null,
    token: null,
    error: null,
    loading: false,
  };
  