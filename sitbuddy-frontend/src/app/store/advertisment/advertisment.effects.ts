import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AdvertismentService } from '../../core/services/advertisment.service';
import * as AdvertismentActions from './advertisment.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AdvertismentEffects {
  constructor(private actions$: Actions, private advertismentService: AdvertismentService) {}

  loadAdvertisments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.loadAdvertisments),
      mergeMap(() =>
        this.advertismentService.getAll().pipe(
          map((advertisments) => AdvertismentActions.loadAdvertismentsSuccess({ advertisments })),
          catchError((error) => of(AdvertismentActions.loadAdvertismentsFailure({ error: error.message })))
        )
      )
    )
  );

  loadUserAdvertisment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.loadUserAdvertisment),
      mergeMap((action) =>
        this.advertismentService.getByUserId(action.userId).pipe(
          map((advertisment) => AdvertismentActions.loadUserAdvertismentSuccess({ advertisment })),
          catchError((error) => of(AdvertismentActions.loadUserAdvertismentFailure({ error: error.message })))
        )
      )
    )
  );

  createAdvertisment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.createAdvertisment),
      mergeMap((action) =>
        this.advertismentService.create(action.advertisment).pipe(
          map((newAd) => AdvertismentActions.createAdvertismentSuccess({ advertisment: newAd })),
          catchError((error) => of(AdvertismentActions.createAdvertismentFailure({ error: error.message })))
        )
      )
    )
  );

  createAdvertismentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.createAdvertismentSuccess),
      map(() => AdvertismentActions.loadAdvertisments()) // Učitavanje svih oglasa samo nakon uspešnog kreiranja
    )
  );

  updateAdvertisment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.updateAdvertisment),
      mergeMap((action) =>
        this.advertismentService.update(action.id, action.advertisment).pipe(
          map((updatedAd) => AdvertismentActions.updateAdvertismentSuccess({ advertisment: updatedAd })),
          catchError((error) => of(AdvertismentActions.updateAdvertismentFailure({ error: error.message })))
        )
      )
    )
  );

  updateAdvertismentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.updateAdvertismentSuccess),
      map(() => AdvertismentActions.loadAdvertisments())
    )
  );

  deleteAdvertisment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.deleteAdvertisment),
      mergeMap((action) =>
        this.advertismentService.delete(action.id).pipe(
          map(() => AdvertismentActions.deleteAdvertismentSuccess({ id: action.id })),
          catchError((error) => of(AdvertismentActions.deleteAdvertismentFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAdvertismentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdvertismentActions.deleteAdvertismentSuccess),
      map(() => AdvertismentActions.loadAdvertisments())
    )
  );
}
