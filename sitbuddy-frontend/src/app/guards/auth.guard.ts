import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { selectToken } from '../store/auth/auth.selectors';
import { selectUser } from '../store/user/user.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest([
      this.store.select(selectToken),
      this.store.select(selectUser),
    ]).pipe(
      take(1),
      map(([token, user]) => this.checkAccess(token, user?.userType, route))
    );
  }

  private checkAccess(token: string | null, userType: string | undefined, route: ActivatedRouteSnapshot): boolean {
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    if (route.routeConfig?.path === 'admin' && userType !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
