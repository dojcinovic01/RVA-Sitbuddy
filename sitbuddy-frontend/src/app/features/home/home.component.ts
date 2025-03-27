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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user$: Observable<User>;

  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(selectUser);
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
