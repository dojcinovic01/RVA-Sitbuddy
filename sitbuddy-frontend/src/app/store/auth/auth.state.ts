export interface AuthState {
  token: string | null;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  token: null,
  error: null,
  loading: false,
};