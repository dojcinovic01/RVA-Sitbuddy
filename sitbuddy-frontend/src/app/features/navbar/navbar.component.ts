import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { selectToken } from '../../store/auth/auth.selectors';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { selectSearchResults, selectUser } from '../../store/user/user.selectors';
import { searchUsers } from '../../store/user/user.actions';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  token$: Observable<string | null>;
  user$: Observable<any>;
  searchQuery = '';
  searchResults$: Observable<any[]>;
  searchSubject : Subject<string> = new Subject();
  imageUrl = environment.imageUrl;
  showResults = false;

  constructor(private store: Store, private router: Router) {
    this.token$ = this.store.select(selectToken);
    this.user$ = this.store.select(selectUser);
    this.searchResults$ = this.store.select(selectSearchResults);

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(query => {
      if (query) {
        this.showResults = true;
        this.store.dispatch(searchUsers({ query }));
      } else {
        this.showResults = false;
      }
    });
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  goToProfile(userId: number) {
    this.router.navigate([`/profile/${userId}`]);
    this.showResults = false;
  }

  @HostListener('document:click')
  onClickOutside() {
    this.showResults = false;
  }

  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
