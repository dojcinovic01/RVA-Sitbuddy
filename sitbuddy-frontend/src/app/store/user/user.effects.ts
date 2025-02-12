import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { loadUser, loadUserSuccess, loadUserFailure, updateUser, updateUserSuccess, updateUserFailure, deleteUser, deleteUserSuccess, deleteUserFailure } from './user.actions';
import { error } from 'node:console';
import { logout } from '../auth/auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService, private store: Store,  private router: Router) {}

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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap(action =>
        this.userService.updateUser(action.userId, action.updatedData).pipe(
          map((user) => updateUserSuccess({ user })), 
          catchError((error) => of(updateUserFailure({ error: error.message }))) 
        )
      )
    )
  );

  deleteUser$ = createEffect(()=>
    this.actions$.pipe(
      ofType(deleteUser),
      mergeMap(action=>
        this.userService.deleteUser(action.userId).pipe(
          map(()=> {
            return deleteUserSuccess();
        }),
          catchError((error)=> of(deleteUserFailure({error:error.message})))
        )
      )
    )
  );

  deleteUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUserSuccess),
      map(() => {
        this.store.dispatch(logout()); 
      })
    ),
    { dispatch: false }
  );
}
