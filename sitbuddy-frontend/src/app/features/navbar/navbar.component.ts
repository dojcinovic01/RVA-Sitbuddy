import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { selectToken } from '../../store/auth/auth.selectors';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { selectSearchResults, selectUser } from '../../store/user/user.selectors';
import { searchUsers } from '../../store/user/user.actions';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  token$: Observable<string | null>;
  user$: Observable<any>;
  searchResults$: Observable<any[]>;

  searchQuery = '';
  private searchSubject = new Subject<string>();
  readonly imageUrl = environment.imageUrl;
  showResults = false;
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private router: Router) {
    this.token$ = this.store.select(selectToken);
    this.user$ = this.store.select(selectUser);
    this.searchResults$ = this.store.select(selectSearchResults);

    this.initializeSearchListener();
  }

  private initializeSearchListener(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.showResults = !!query;
      if (query) {
        this.store.dispatch(searchUsers({ query }));
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  goToProfile(userId: number): void {
    this.router.navigate([`/profile/${userId}`]);
    this.showResults = false;
  }

  @HostListener('document:click')
  onClickOutside(): void {
    this.showResults = false;
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

