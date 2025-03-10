import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { selectToken } from '../store/auth/auth.selectors';
import { selectUser } from '../store/user/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  // canActivate(): Observable<boolean> {
  //   return this.store.select(selectToken).pipe(
  //     take(1),
  //     map(token => {
  //       if (token) {
  //         return true;
  //       } else {
  //         this.router.navigate(['/login']);
  //         return false;
  //       }
  //     })
  //   );
  // }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return combineLatest([
      this.store.select(selectToken),
      this.store.select(selectUser)
    ]).pipe(
      take(1),
      map(([token, user]) => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }
        const isAdminRoute = route.routeConfig?.path === 'admin';
        if (isAdminRoute && user?.userType !== 'admin') {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
  
}
