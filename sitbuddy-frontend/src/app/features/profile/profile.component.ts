import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';
import { selectToken} from '../../store/auth/auth.selectors';
import { selectUser } from '../../store/user/user.selectors';
import { Observable, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadUser, updateUser } from '../../store/user/user.actions';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule],
  template: `
  <app-navbar></app-navbar>
  <div class="profile-container">
    <div class="profile-content">
      <div class="avatar">{{ (user$ | async)?.initials }}</div>
      <form [formGroup]="dataForm" >
          <div class="input-group">
            <label for="fullName">Ime i prezime</label>
            <input id="fullName" formControlName="fullName" type="text" placeholder="{{(user$ | async)?.fullName}}" />
          </div>

          <div class="input-group">
            <label for="oldPassword">Stara lozinka</label>
            <input id="oldPassword" formControlName="oldPassword" type="password" placeholder="Unesite vašu staru lozinku" />
          </div>

          <div class="input-group">
            <label for="newPassword">Nova lozinka</label>
            <input id="newPassword" formControlName="newPassword" type="password" placeholder="Nova lozinka" />
          </div>

          <div class="input-group">
            <label for="location">Lokacija</label>
            <input id="location" formControlName="location" type="text" placeholder="{{(user$ | async)?.location}}"/>
          </div>

          <div class="input-group">
            <label for="phoneNumber">Broj telefona</label>
            <input id="phoneNumber" formControlName="phoneNumber" type="tel" placeholder="{{(user$ | async)?.phoneNumber}}" />
          </div>

          <span class="update-icon"  (click)="updateData()">
            <mat-icon>update</mat-icon>
            <p class="azuriraj-text">Ažuriraj podatke</p>
          </span>

        </form>
    </div>  
  </div>
  `,
  styles: [`
      .profile-container {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        justify-content: center; /* Centriranje vertikalno */
        align-items: center; /* Centriranje horizontalno */
        height: 95vh;
      }

      .profile-content {
        justify-content: center; /* Centriranje vertikalno */
        align-items: center; /* Centriranje horizontalno */
        background: linear-gradient(135deg, #FF204E, #00224D);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        padding: 30px;
        width: 35%; /* Ograničava širinu, ali omogućava responsivnost */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .avatar {
        width: 40px;
        height: 40px;
        background: #FF204E;
        color: white;
        font-size: 28px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }
      h1, p {
        color:rgb(255, 255, 255);
      }
      .logout-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 20px;
        background: #FF204E;
        color: white;
        border: none;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        transition: background 0.3s;
      }
      .logout-btn:hover {
        background: #A0153E;
      }
      mat-icon {
        font-size: 20px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 25px;
        max-width: 400px;
        width: 100%;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
        
      }

      label {
        font-weight: bold;
        color: #FFFFFF;
      }

      input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        transition: border-color 0.3s;
        background:rgb(233, 25, 88);
        color: #FFFFFF;
        border-color: #FF204E;
      }

      input::placeholder {
        color: #FFFFFF; 
        font-style: italic;
        opacity: 1; 
      }


      input:focus {
        border-color: #FF204E;
        outline: none;
        box-shadow: 0 0 5px rgba(255, 32, 78, 0.5);
      }

      .mat-icon {
        color: white;
        text-decoration: none;
        font-size: 18px;
      }
      
      .update-icon {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        gap: 5px; 
        color: white;
        transition: transform 0.2s, color 0.3s;
      }

      .update-icon:hover mat-icon{
        transform: scale(1.1);
        color: #FF204E;
      }

      .update-icon:hover{
        transform: scale(1.1);
        color: #FF204E;
      }

      .update-icon mat-icon {
        font-size: 28px;
      }

      .azuriraj-text {
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        color: #FF204E;
      }

  `],
})
export class ProfileComponent {
  user$: Observable<any>;
  token$: Observable<string | null>;
  dataForm: FormGroup;

  constructor(private store: Store, private router: Router, private fb: FormBuilder) {

    this.user$ = this.store.select(selectUser);
    this.token$ = this.store.select(selectToken);

    this.dataForm = this.fb.group({
      fullName: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

  }

  updateData() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;

      const updatePayload: any = {
        userId: user.id, // Pretpostavljam da korisnik ima `id` polje
        fullName: this.dataForm.value.fullName,
        location: this.dataForm.value.location,
        phoneNumber: this.dataForm.value.phoneNumber
      };

      // Ako je uneta nova lozinka, dodati je u payload
      if (this.dataForm.value.oldPassword && this.dataForm.value.newPassword) {
        updatePayload.oldPassword = this.dataForm.value.oldPassword;
        updatePayload.newPassword = this.dataForm.value.newPassword;
      }

      this.store.dispatch(updateUser({ userId: user.id, updatedData: updatePayload }));
    });
  }
}

