import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Advertisment } from '../../store/advertisment/advertisment.state';
import * as AdvertismentActions from '../../store/advertisment/advertisment.actions';
import { selectAllAdvertisments } from '../../store/advertisment/advertisment.selectors';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-advertisment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './advertisment-list.component.html',
  styleUrls: ['./advertisment-list.component.scss']
})
export class AdvertismentListComponent implements OnInit {
  advertisments$: Observable<Advertisment[]>;

  constructor(private store: Store, private router: Router) {
    this.advertisments$ = this.store.select(selectAllAdvertisments);
  }

  ngOnInit(): void {
    this.store.dispatch(AdvertismentActions.loadAdvertisments());
    this.advertisments$.subscribe(advertisments => {
      console.log(advertisments);
    });
  }

  navigateToProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }
}
