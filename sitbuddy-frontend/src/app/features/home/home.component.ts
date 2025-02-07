import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { selectToken } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <div class="home-container">
    <app-navbar></app-navbar>
    <div class="homePage">
      <h1>Welcome to Home Page!</h1>
      <p>You are successfully logged in.</p>
    </div>  
  </div>
  `,
  styles: [
    `
      .home-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background:rgb(255, 255, 255);
      }

      .homePage {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px;
        color: white;
      }

      h1 {
        font-size: 32px;
        margin-bottom: 10px;
        text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.2);
      }

      p {
        font-size: 18px;
        opacity: 0.9;
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
      this.store.select(selectToken).subscribe(token => {
        if (!token) {
          this.router.navigate(['/login']);
        }
      });
  }
}
