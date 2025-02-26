// follow.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map, Observable } from 'rxjs';
import { selectFollowing } from '../../store/follow/follow.selectors';
import * as FollowActions from '../../store/follow/follow.actions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
})
export class FollowComponent implements OnInit {
  @Input() loogedInId!: string;
  @Input() profileId!: string;
  isFollowing$: Observable<boolean> | undefined;
  following$ : Observable<any> | undefined;

  constructor(private store: Store) {
     this.following$= this.store.select(selectFollowing);
  }

  ngOnInit(): void {
    this.store.dispatch(FollowActions.loadFollowing({ userId: Number(this.loogedInId) }));

    this.isFollowing$ = this.store.select(selectFollowing).pipe(
        map(following => following.some((user: any) => user.id === Number(this.profileId)))
    );
      
  }
  

  toggleFollow() {
    this.isFollowing$?.pipe(first()).subscribe(isFollowing => {
        if (isFollowing) {
        this.store.dispatch(FollowActions.unfollowUser({ followerId: Number(this.loogedInId), followingId: Number(this.profileId) }));
        } else {
        this.store.dispatch(FollowActions.followUser({ followerId: Number(this.loogedInId), followingId: Number(this.profileId) }));
        }
    });
    }
}
