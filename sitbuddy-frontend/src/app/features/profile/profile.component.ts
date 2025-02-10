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
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule],
  template: `
  <app-navbar></app-navbar>
  <div class="profile-container">
    <div class="profile-content">
    <div class="avatar">
      <img 
        *ngIf="(user$ | async)?.profilePicture" 
        [src]="'http://localhost:3000/uploads/profile-pictures/' + (user$ | async)?.profilePicture"  
        alt="Profilna slika" 
      />
      <div *ngIf="!(user$ | async)?.profilePicture" class="default-avatar">
        <!-- Prikazati neku default ikonicu ili inicijale korisnika -->
      </div>
    </div>
    <div class="criminal-proof">
      <img 
        *ngIf="(user$ | async)?.criminalRecordProof" 
        [src]="'http://localhost:3000/uploads/criminal-records/' + (user$ | async)?.criminalRecordProof"  
        alt="Potvrda o neosuđivanosti" 
      />
      <div *ngIf="!(user$ | async)?.criminalRecordProof" class="default-proof">
        <!-- Prikazati neku default ikonicu -->
      </div>
    </div>

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

          <div class="update-elements">
            <div class="update-icon"  (click)="updateData()">
              <mat-icon>update</mat-icon>
              <p class="azuriraj-text">Ažuriraj podatke</p>
            </div>

            <div class="update-profile-image"  (click)="openFileInput()">
              <mat-icon>camera_enhance</mat-icon>
              <p class="azuriraj-profilnu">Dodaj profilnu sliku</p>
            </div>

            <div class="update-criminal-image" (click)="openCriminalFileInput()">
              <mat-icon>image_search</mat-icon>
              <p class="azuriraj-neosudjivanost">Dodaj potvrdu o neosudjivanosti</p>
            </div>

          </div>
        <!-- Dodaj ovo u template -->
          <input 
            type="file" 
            id="profileImageInput" 
            style="display: none;" 
            (change)="onFileSelected($event)" 
            accept="image/*" 
          />
          <input 
            type="file" 
            id="criminalRecordInput" 
            style="display: none;" 
            (change)="onCriminalFileSelected($event)" 
            accept="image/*" 
          />

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
      .avatar, .criminal-proof {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ccc; /* Boja za default avatar */
      }

      .avatar img, .criminal-proof img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

     

      .update-elements{
        display: flex;
        flex-direction: row;
        align-items: center; 
        justify-content: center; 
        gap: 20px; 

      }
      .update-icon, .update-profile-image, .update-criminal-image {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer;
        gap: 5px; 
        color: white;
        transition: transform 0.2s, color 0.3s;
      }

      .update-icon:hover mat-icon, .update-profile-image:hover mat-icon, .update-criminal-image:hover mat-icon{
        transform: scale(1.1);
        color: #FF204E;
      }

      .update-icon:hover, .update-profile-image:hover, .update-criminal-image:hover{
        transform: scale(1.1);
        color: #FF204E;
      }


      .azuriraj-text, .azuriraj-profilnu,.azuriraj-neosudjivanost {
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

  constructor(private store: Store, private router: Router, private fb: FormBuilder, private userService: UserService) {

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

  openFileInput() {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput.click(); // Otvara dijalog za odabir fajla
  }

  // Dodaj ovu metodu za rukovanje odabranim fajlom
  onFileSelected(event: Event) {
    console.log("EVENT",event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadProfileImage(file); // Pozovi metodu za upload
    }
  }

  uploadProfileImage(file: File) {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;

      const formData = new FormData();
      formData.append('file', file); // Dodaj fajl u FormData
      formData.append('userId', user.id.toString()); // Dodaj userId

      // Pozovi HTTP servis za upload
      this.userService.uploadProfilePicture(formData).subscribe({
        next: (response) => {
          console.log('Profilna slika uspešno uploadovana:', response);
          // Osvježi podatke korisnika nakon uspešnog uploada
          this.store.dispatch(loadUser({ userId: user.id }));
        },
        error: (error) => {
          console.error('Greška pri uploadu profilne slike:', error);
        }
      });
    });
  }

  openCriminalFileInput() {
    const fileInput = document.getElementById('criminalRecordInput') as HTMLInputElement;
    fileInput.click();
  }
  
  onCriminalFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadCriminalRecord(file);
    }
  }
  
  uploadCriminalRecord(file: File) {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id.toString());
  
      this.userService.uploadCriminalRecord(formData).subscribe({
        next: (response) => {
          console.log('Potvrda uspešno uploadovana:', response);
          this.store.dispatch(loadUser({ userId: user.id })); // Osvježavanje podataka
        },
        error: (error) => {
          console.error('Greška pri uploadu potvrde:', error);
        }
      });
    });
  }
  
}

