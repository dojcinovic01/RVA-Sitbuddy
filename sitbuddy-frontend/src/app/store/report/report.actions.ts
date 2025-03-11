import { createAction, props } from '@ngrx/store';
import { Report, ReportType } from './report.state';

// Učitavanje prijava
export const loadReports = createAction(
  '[Report] Load Reports',
  props<{ reportType: ReportType }>()
);

export const loadReportsSuccess = createAction(
  '[Report] Load Reports Success',
  props<{ reports: Report[] }>()
);

export const loadReportsFailure = createAction(
  '[Report] Load Reports Failure',
  props<{ error: string }>()
);

// Brisanje prijave
export const deleteReport = createAction(
  '[Report] Delete Report',
  props<{ reportId: number }>()
);

export const deleteReportSuccess = createAction(
  '[Report] Delete Report Success',
  props<{ reportId: number }>()
);

export const deleteReportFailure = createAction(
  '[Report] Delete Report Failure',
  props<{ error: string }>()
);

export const deleteReportedContent = createAction(
    '[Report] Delete Reported Content',
    props<{ report: Report }>()
  );
