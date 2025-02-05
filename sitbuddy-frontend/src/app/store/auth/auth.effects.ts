import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, loadAuthState, logout, register, registerSuccess, registerFailure } from './auth.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<any>,
    private authService: AuthService,
    private router: Router
  ) {
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

  loadAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAuthState),
      map(() => {
        const user = this.authService.getUser();
        const token = this.authService.getToken();
        if (user && token) {
          return loginSuccess({ user, token });
        } else {
          return { type: 'NO_ACTION' }; // Ako nema podataka, ne radimo ništa
        }
      })
    )
  );

  redirectAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(() => {
        this.router.navigate(['/home']);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap(({ name, email, password, location, phoneNumber, userType }) =>
        this.authService.register(name, email, password, location, phoneNumber, userType).pipe(
          map(response => {
            this.authService.saveAuthData(response.user, response.token);
            return registerSuccess({ user: response.user, token: response.token });
          }),
          catchError(error => of(registerFailure({ error: error.message })))
        )
      )
    )
  );
  
}