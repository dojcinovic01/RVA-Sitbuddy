import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Advertisment } from '../../store/advertisment/advertisment.state';
import * as AdvertismentActions from '../../store/advertisment/advertisment.actions';
import { 
  selectAllAdvertisments, 
  selectUserAdvertisment, 
  selectAdvertismentLoading, 
  selectAdvertismentError 
} from '../../store/advertisment/advertisment.selectors';
import { selectUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-advertisment',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.scss']
})
export class AdvertismentComponent implements OnInit {
  user$: Observable<any>;
  advertisments$: Observable<Advertisment[]>;
  userAdvertisment$: Observable<Advertisment | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  newAdvertisment: Omit<Advertisment, 'id'> = { 
    title: '', 
    description: '', 
    adFrom: undefined 
  };
  isEditing = false;
  editedAdvertisment: Partial<Advertisment> = {};

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.advertisments$ = this.store.select(selectAllAdvertisments);
    this.userAdvertisment$ = this.store.select(selectUserAdvertisment);
    this.loading$ = this.store.select(selectAdvertismentLoading);
    this.error$ = this.store.select(selectAdvertismentError);
  }

  ngOnInit(): void {
    this.store.dispatch(AdvertismentActions.loadAdvertisments());
    this.initializeUserAdvertisment();
  }

  private initializeUserAdvertisment(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.newAdvertisment.adFrom = user;
        this.store.dispatch(AdvertismentActions.loadUserAdvertisment({ 
          userId: user.id 
        }));
      }
    });
  }

  createAdvertisment(): void {
    if (this.isValidAdvertisment(this.newAdvertisment)) {
      const payload = this.createAdvertismentPayload(this.newAdvertisment);
      this.store.dispatch(AdvertismentActions.createAdvertisment({ 
        advertisment: payload 
      }));
      this.resetAdvertismentForm();
    }
  }

  private isValidAdvertisment(ad: Partial<Advertisment>): boolean {
    return !!ad.title && !!ad.description && !!ad.adFrom;
  }

  private createAdvertismentPayload(ad: Omit<Advertisment, 'id'>): any {
    return {
      title: ad.title,
      description: ad.description,
      adFromId: ad.adFrom?.id
    };
  }

  private resetAdvertismentForm(): void {
    this.newAdvertisment = { 
      title: '', 
      description: '', 
      adFrom: this.newAdvertisment.adFrom 
    };
  }

  updateAdvertisment(advertisment: Advertisment): void {
    this.store.dispatch(AdvertismentActions.updateAdvertisment({ 
      id: advertisment.id, 
      advertisment 
    }));
  }

  deleteAdvertisment(id: number): void {
    this.store.dispatch(AdvertismentActions.deleteAdvertisment({ id }));
  }

  toggleEditMode(userAdvertisment: Advertisment): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedAdvertisment = { ...userAdvertisment };
    }
  }
  
  saveChanges(): void {
    if (this.isValidAdvertisment(this.editedAdvertisment)) {
      this.updateAdvertisment(this.editedAdvertisment as Advertisment);
      this.isEditing = false;
    }
  }
}