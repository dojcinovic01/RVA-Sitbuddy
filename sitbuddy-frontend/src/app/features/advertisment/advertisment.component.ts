import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Advertisment } from '../../store/advertisment/advertisment.state';
import * as AdvertismentActions from '../../store/advertisment/advertisment.actions';
import { selectAllAdvertisments, selectUserAdvertisment, selectAdvertismentLoading, selectAdvertismentError } from '../../store/advertisment/advertisment.selectors';
import { selectUser } from '../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-advertisment',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule,FormsModule],
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.scss']
})
export class AdvertismentComponent implements OnInit {
  user$: Observable<any>;
  advertisments$: Observable<Advertisment[]>;
  userAdvertisment$: Observable<Advertisment | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  newAdvertisment: Omit<Advertisment, 'id'> = { title: '', description: '', adFrom: undefined };
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
    this.user$.subscribe(user => {
        if (user) {
            //console.log(user);
            this.newAdvertisment.adFrom = user; // Dodeljujemo ceo objekat korisnika
            this.store.dispatch(AdvertismentActions.loadUserAdvertisment({ userId: user.id }));
        }
    });
  }

  createAdvertisment(): void {
    if (this.newAdvertisment.title && this.newAdvertisment.description && this.newAdvertisment.adFrom) {
      const payload = {
        title: this.newAdvertisment.title,
        description: this.newAdvertisment.description,
        adFromId: this.newAdvertisment.adFrom.id, 
      };
      
      this.store.dispatch(AdvertismentActions.createAdvertisment({ advertisment: payload }));
      this.newAdvertisment = { title: '', description: '', adFrom: undefined };
    }
  }
  

  updateAdvertisment(advertisment: Advertisment): void {
    this.store.dispatch(AdvertismentActions.updateAdvertisment({ id: advertisment.id, advertisment }));
  }

  deleteAdvertisment(id: number): void {
    this.store.dispatch(AdvertismentActions.deleteAdvertisment({ id }));
  }

  toggleEditMode(userAdvertisment: Advertisment) {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      // Kopiramo podatke oglasa kako bismo ih mogli menjati u formi
      this.editedAdvertisment = { ...userAdvertisment };
    }
  }
  
  saveChanges() {
    if (this.editedAdvertisment.title && this.editedAdvertisment.description) {
      this.updateAdvertisment(this.editedAdvertisment as Advertisment);
      this.isEditing = false;
    }
  }
}
