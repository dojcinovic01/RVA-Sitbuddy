import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportState } from './report.state';

export const selectReportState = createFeatureSelector<ReportState>('report');
export const selectReports = createSelector(selectReportState, state => state.reports);
export const selectReportsLoading = createSelector(selectReportState, state => state.loading);
export const selectReportsError = createSelector(selectReportState, state => state.error);