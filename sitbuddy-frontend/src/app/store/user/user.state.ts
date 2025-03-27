export interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  searchResults: any[];
}

export const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
  searchResults: [],
};