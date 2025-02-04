import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure } from './auth.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions<any>, private authService: AuthService) {
    //console.log('Actions service initialized:', actions$);
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => {
            this.authService.saveAuthData(response.user, response.token);
            return loginSuccess({ user: response.user, token: response.token });
          }),
          catchError(error => of(loginFailure({ error: error.message })))
        )
      )
    )
  );
}