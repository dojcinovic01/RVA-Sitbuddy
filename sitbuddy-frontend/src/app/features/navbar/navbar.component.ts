import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { selectToken } from '../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import { selectUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="logo">Sitbuddy</div>
      <ul class="nav-links">
        <li>
          <a routerLink="/home" routerLinkActive="active">
            <mat-icon>home</mat-icon>
          </a>
        </li>
        <li *ngIf="(user$ | async) as user">
          <a [routerLink]="['/profile', user.id]" routerLinkActive="active">
            <mat-icon>person</mat-icon>
          </a>
        </li>

        <li *ngIf="(token$ | async) as token">
          <mat-icon (click)="onLogout()">exit_to_app</mat-icon>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background: linear-gradient(90deg, #00224D, #FF204E);
        color: white;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
      }
      .nav-links {
        list-style: none;
        display: flex;
        gap: 20px;
      }
      .nav-links a {
        color: white;
        text-decoration: none;
        font-size: 18px;
      }
      .nav-links a.active {
        border-bottom: 2px solid #FF204E;
      }
      
      .nav-links li:hover mat-icon {
        color: #FF204E;
        cursor: pointer;
     }

    `,
  ],
})
export class NavbarComponent {
  token$: Observable<string | null>;
  user$: Observable<any>;

  constructor(private store: Store, private router: Router) {
    this.token$ = this.store.select(selectToken);
    this.user$ = this.store.select(selectUser);
  }

  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
