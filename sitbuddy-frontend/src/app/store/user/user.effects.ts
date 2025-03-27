import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import {
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  searchUsers,
  searchUsersSuccess,
  searchUsersFailure,
} from './user.actions';
import { logout } from '../auth/auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService, private store: Store, private router: Router) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(({ userId }) =>
        this.userService.getUser(userId).pipe(
          map((user) => loadUserSuccess({ user })),
          catchError(({ message }) => of(loadUserFailure({ error: message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap(({ userId, updatedData }) =>
        this.userService.updateUser(userId, updatedData).pipe(
          map((user) => updateUserSuccess({ user })),
          catchError(({ message }) => of(updateUserFailure({ error: message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      mergeMap(({ userId }) =>
        this.userService.deleteUser(userId).pipe(
          map(() => deleteUserSuccess()),
          catchError(({ message }) => of(deleteUserFailure({ error: message })))
        )
      )
    )
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteUserSuccess),
        tap(() => this.store.dispatch(logout()))
      ),
    { dispatch: false }
  );

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchUsers),
      mergeMap(({ query }) =>
        this.userService.searchUsers(query).pipe(
          map((users) => searchUsersSuccess({ users })),
          catchError(({ message }) => of(searchUsersFailure({ error: message })))
        )
      )
    )
  );
}
