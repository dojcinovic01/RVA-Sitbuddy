import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FollowService } from '../../core/services/follow.service';
import {
  followUser,
  followUserSuccess,
  followUserFailure,
  unfollowUser,
  unfollowUserSuccess,
  unfollowUserFailure,
  loadFollowing,
  loadFollowingSuccess,
  loadFollowingFailure,
  loadFollowers,
  loadFollowersSuccess,
  loadFollowersFailure,
} from './follow.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class FollowEffects {
  constructor(private actions$: Actions, private followService: FollowService) {}

  loadFolllowing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFollowing),
      mergeMap(({ userId }) =>
        this.followService.getFollowing(userId).pipe(
          map((following) => loadFollowingSuccess({ following })),
          catchError((error) => of(loadFollowingFailure({ error: error.message })))
        )
      )
    )
  );

  followUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(followUser),
      mergeMap(({ followerId, followingId }) =>
        this.followService.followUser(followerId, followingId).pipe(
          map(() => followUserSuccess({ followerId, followingId })), // ⚡ Sada prosleđujemo oba ID-ja
          catchError((error) => of(followUserFailure({ error: error.message })))
        )
      )
    )
  );

  unfollowUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unfollowUser),
      mergeMap(({ followerId, followingId }) =>
        this.followService.unfollowUser(followerId, followingId).pipe(
          map(() => unfollowUserSuccess({ followerId, followingId })), // ⚡ Sada prosleđujemo oba ID-ja
          catchError((error) => of(unfollowUserFailure({ error: error.message })))
        )
      )
    )
  );

  followUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(followUserSuccess),
      map(({ followerId }) => loadFollowing({ userId: followerId })) // ✅ Sada koristimo followerId
    )
  );

  unfollowUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unfollowUserSuccess),
      map(({ followerId }) => loadFollowing({ userId: followerId })) // ✅ Sada koristimo followerId
    )
  );
}
