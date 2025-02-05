import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Welcome to Home Page!</h1>
      <p>You are successfully logged in.</p>
      <button (click)="onLogout()">Logout</button>
    </div>
  `,
  styles: [
    `
      div {
        text-align: center;
        margin-top: 50px;
      }
      button {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: red;
        color: white;
        border: none;
        cursor: pointer;
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private store: Store, private router: Router) {}

  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']); // Preusmeri korisnika na login
  }
}
