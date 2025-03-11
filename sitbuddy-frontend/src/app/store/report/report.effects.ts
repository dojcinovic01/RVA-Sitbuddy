import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ReportActions from './report.actions';
import { ReportService } from '../../core/services/report.service';

@Injectable()
export class ReportEffects {
  constructor(private actions$: Actions, private reportService: ReportService) {}

  loadReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.loadReports),
      mergeMap(({ reportType }) =>
        this.reportService.getReportsByType(reportType).pipe(
          map((reports) => ReportActions.loadReportsSuccess({ reports })),
          catchError((error) => of(ReportActions.loadReportsFailure({ error: error.message })))
        )
      )
    )
  );

  deleteReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.deleteReport),
      mergeMap(({ reportId }) =>
        this.reportService.deleteReport(reportId).pipe(
          map(() => ReportActions.deleteReportSuccess({ reportId })),
          catchError((error) => of(ReportActions.deleteReportFailure({ error: error.message })))
        )
      )
    )
  );

  deleteReportedContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportActions.deleteReportedContent),
      mergeMap(({ report }) => {
        return this.reportService.deleteReportedContent(report.id).pipe(
          map(() => ReportActions.deleteReportSuccess({ reportId: report.id })),
          catchError((error) => of(ReportActions.deleteReportFailure({ error: error.message })))
        );
      })
    )
  );
}
