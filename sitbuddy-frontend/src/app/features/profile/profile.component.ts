import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';
import { selectToken } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatIconModule],
  template: `
  <div class="profile-container">
    <app-navbar></app-navbar>
    <div class="profile-content">
      <div class="avatar">JD</div>
      <h1>John Doe</h1>
      <p>Email: johndoeexample.com</p>
      <button class="logout-btn" (click)="onLogout()">
        <mat-icon>logout</mat-icon> Logout
      </button>
    </div>  
  </div>
  `,
  styles: [
    `
      .profile-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #021526;
        color: white;
      }

      .profile-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px;
      }

      .avatar {
        width: 80px;
        height: 80px;
        background: #FF204E;
        color: white;
        font-size: 28px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin-bottom: 15px;
      }

      h1 {
        font-size: 28px;
        margin-bottom: 8px;
      }

      p {
        font-size: 16px;
        opacity: 0.9;
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 20px;
        background: #FF204E;
        color: white;
        border: none;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        transition: background 0.3s;
      }

      .logout-btn:hover {
        background: #A0153E;
      }

      mat-icon {
        font-size: 20px;
      }
    `,
  ],
})
export class ProfileComponent {
  constructor(private store: Store, private router: Router) {}

   ngOnInit(): void {
        this.store.select(selectToken).subscribe(token => {
          if (!token) {
            this.router.navigate(['/login']);
          }
        });
}

    onLogout() {
        this.store.dispatch(logout());
        this.router.navigate(['/login']);
    }
}
