import { createReducer, on } from '@ngrx/store';
import { initialReportState } from './report.state';
import * as ReportActions from './report.actions';

export const reportReducer = createReducer(
  initialReportState,
  on(ReportActions.loadReports, state => ({ ...state, loading: true, error: null })),
  on(ReportActions.loadReportsSuccess, (state, { reports }) => ({ ...state, reports, loading: false })),
  on(ReportActions.loadReportsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(ReportActions.deleteReportSuccess, (state, { reportId }) => ({
    ...state,
    reports: state.reports.filter(report => report.id !== reportId)
  }))
);