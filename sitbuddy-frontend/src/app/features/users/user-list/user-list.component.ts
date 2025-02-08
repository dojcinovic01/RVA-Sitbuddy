import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { selectUserAuth } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>User List</h2>
      <div *ngIf="user$ | async as user; else loading">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      </div>
      <ng-template #loading>
        <p>Loading user data...</p>
      </ng-template>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  user$: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUserAuth);
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      console.log('User data:', user);
    });
  }
}