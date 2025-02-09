import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, register, registerSuccess, registerFailure, checkAuthStatus } from './auth.actions';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { loadUserSuccess } from '../user/user.actions';
import { UserService } from '../../core/services/user.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<any>,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => {
            this.authService.saveAuthData(response.token);
            return loginSuccess({ token: response.token });
          }),
          catchError(error => of(loginFailure({ error: error.message })))
        )
      )
    )
  );

  loadUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      switchMap(() =>
        this.userService.getCurrentUser().pipe( // Poziva /auth/profile i čeka odgovor
          map(user => loadUserSuccess({ user })), // Prosleđuje dobijene podatke u store
          catchError(error => {
            console.error("Greška pri učitavanju korisnika:", error);
            return of({ type: 'LOAD_USER_FAILURE' }); // Izbegavanje rušenja aplikacije
          })
        )
      )
    )
  );
  

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  checkAutStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkAuthStatus),
      map(() => {
        const token = this.authService.getToken();
        if (token) {
          return loginSuccess({ token });
        } else {
          return { type: 'NO_ACTION' }; // Ako nema podataka, ne radimo ništa
        }
      })
    )
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
      mergeMap(({ fullName, email, password, location, phoneNumber, userType }) =>
        this.authService.register(fullName, email, password, location, phoneNumber, userType).pipe(
          map(() => {
            alert('Registracija uspešna! Preusmeravanje na login stranicu...');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
  
            return registerSuccess(); 
          }),
          catchError(error => of(registerFailure({ error: error.message })))
        )
      )
    )
  );

  
  
}