import { createAction, props } from '@ngrx/store';
import { Report, ReportType } from './report.state';

export const loadReports = createAction('[Report] Load Reports', props<{ reportType: ReportType }>());
export const loadReportsSuccess = createAction('[Report] Load Reports Success', props<{ reports: Report[] }>());
export const loadReportsFailure = createAction('[Report] Load Reports Failure', props<{ error: string }>());

export const deleteReport = createAction('[Report] Delete', props<{ reportId: number }>());
export const deleteReportSuccess = createAction('[Report] Delete Success', props<{ reportId: number }>());
export const deleteReportFailure = createAction('[Report] Delete Failure', props<{ error: string }>());

export const deleteReportedContent = createAction('[Report] Delete Reported Content', props<{ report: Report }>());
