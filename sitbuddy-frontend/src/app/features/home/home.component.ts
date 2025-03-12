import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { selectToken } from '../../store/auth/auth.selectors';
import { AdvertismentComponent } from "../advertisment/advertisment.component";
import { AdvertismentListComponent } from '../advertisment-list/advertisment-list.component';
import { selectUser } from '../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { User } from '../../store/advertisment/advertisment.state';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AdvertismentComponent, AdvertismentListComponent],
  template: `
   <div class="home-container">
    <app-navbar></app-navbar>
    <app-advertisment></app-advertisment>
    <app-advertisment-list [user]="user$ | async"></app-advertisment-list>
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
  user$: Observable<User>;

  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(selectUser); // Selektujemo korisnika jednom i prosleđujemo
  }

  ngOnInit(): void {
    this.store.select(selectToken).subscribe(token => {
      if (token) {
        this.user$.subscribe(user => {
          if (user?.userType === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        });
      }
    });
  }
}
