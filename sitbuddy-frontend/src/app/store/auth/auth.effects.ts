import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { login, loginSuccess, loginFailure, logout, register, registerSuccess, registerFailure, checkAuthStatus } from './auth.actions';
import { loadUserFailure, loadUserSuccess } from '../user/user.actions';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    mergeMap(({ email, password }) =>
      this.authService.login(email, password).pipe(
        map(({ token }) => {
          this.authService.saveAuthData(token);
          return loginSuccess({ token });
        }),
        catchError(error => of(loginFailure({ error: error.message })))
      )
    )
  ));

  loadUserAfterLogin$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    switchMap(() =>
      this.userService.getCurrentUser().pipe(
        map(user => loadUserSuccess({ user })),
        catchError(error => of(loadUserFailure({ error: error.message })))
      )
    )
  ));

  checkAuthStatus$ = createEffect(() => this.actions$.pipe(
    ofType(checkAuthStatus),
    map(() => {
      const token = this.authService.getToken();
      return token ? loginSuccess({ token }) : { type: 'NO_ACTION' };
    })
  ));

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(logout),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        window.location.reload();
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    mergeMap(({ fullName, email, password, location, phoneNumber, userType, hourlyRate }) =>
      this.authService.register(fullName, email, password, location, phoneNumber, userType, hourlyRate).pipe(
        map(() => {
          alert('Registracija uspešna! Preusmeravanje na login stranicu...');
          setTimeout(() => this.router.navigate(['/login']), 3000);
          return registerSuccess();
        }),
        catchError(error => of(registerFailure({ error: error.message })))
      )
    )
  ));
}