export enum ReportType {
    USER = 'user',
    ADVERTISMENT = 'advertisment',
    REVIEW = 'review'
  }
  
  export interface Report {
    id: number;
    type: ReportType;
    reason: string;
    createdAt: string;
    reportedUser?: {
      id: number;
      fullName: string;
      email: string;
      profilePicture?: string;
    };
    reportedAdvertisment?: {
      id: number;
      title: string;
      description: string;
      adFrom: {
        id: number;
        fullName: string;
        email: string;
        profilePicture?: string;
      };
    };
    reportedReview?: {
      id: number;
      comment: string;
      rating: number;
      reviewFrom: {
        id: number;
        fullName: string;
        email: string;
      };
      reviewTo: {
        id: number;
        fullName: string;
        email: string;
      };
    };
  }

  export interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
  }
  
  export const initialReportState: ReportState = {
    reports: [],
    loading: false,
    error: null
  };