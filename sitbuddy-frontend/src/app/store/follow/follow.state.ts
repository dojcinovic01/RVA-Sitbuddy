export interface FollowState {
  following: any[]; 
  followers: any[]; 
  loading: boolean;
  error: string | null;
}

export const initialFollowState: FollowState = {
  following: [],
  followers: [],
  loading: false,
  error: null,
};