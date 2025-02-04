import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { loadUser, loadUserSuccess, loadUserFailure } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(action =>
        this.userService.getUser(action.userId).pipe(
          map(user => loadUserSuccess({ user })),
          catchError(error => of(loadUserFailure({ error: error.message })))
        )
      )
    )
  );
}
