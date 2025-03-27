export enum ReportType { USER = 'user', ADVERTISMENT = 'advertisment', REVIEW = 'review' }

export interface ReportEntity {
  id: number;
  fullName: string;
  email: string;
  profilePicture?: string;
}

export interface Report {
  id: number;
  type: ReportType;
  reason: string;
  createdAt: string;
  reportedUser?: ReportEntity;
  reportedAdvertisment?: {
    id: number;
    title: string;
    description: string;
    adFrom: ReportEntity;
  };
  reportedReview?: {
    id: number;
    comment: string;
    rating: number;
    reviewFrom: ReportEntity;
    reviewTo: ReportEntity;
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