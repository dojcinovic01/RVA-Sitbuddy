export interface User {
    id: number;
    fullName: string;
    email: string;
    profilePicture: string;
    userType: "parent" | "sitter";
}

export interface Review {
    id: number;
    comment: string;
    rating: number;
    reviewFrom: User;
    reviewTo: User;
}

export interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

export const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null
};