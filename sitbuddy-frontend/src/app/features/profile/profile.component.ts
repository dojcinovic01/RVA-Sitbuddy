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
import { deleteUser, loadUser, updateUser } from '../../store/user/user.actions';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule],
  template: `
  <app-navbar></app-navbar>
  <div class="profile-container">
    <div class="profile-content">
      <div class="images-container">
        <div class="avatar" (click)="openFileInput('profilePicture')">
          <img 
            *ngIf="(user$ | async)?.profilePicture" 
            [src]="'http://localhost:3000/uploads/profile-pictures/' + (user$ | async)?.profilePicture"  
            alt="Profilna slika" 
          />
          <div *ngIf="!(user$ | async)?.profilePicture" class="default-avatar">
              <mat-icon>camera_enhance</mat-icon>
          </div>
        </div>
        
        <div class="criminal-proof" (click)="OpenCriminalProof()">
          <div *ngIf="(user$ | async)?.criminalRecordProof">
            <mat-icon>check_circle</mat-icon>
          </div>
          
          <div *ngIf="!(user$ | async)?.criminalRecordProof" class="default-proof">
            <mat-icon>error</mat-icon>
          </div>
        </div>
      </div>
    

      <form [formGroup]="dataForm" >
          <div class="input-group">
            <label for="fullName">Ime i prezime</label>
            <input id="fullName" formControlName="fullName" type="text" placeholder="{{(user$ | async)?.fullName}}" />
          </div>

          <div class="input-group">
            <label for="oldPassword">Trenutna lozinka</label>
            <input id="oldPassword" formControlName="oldPassword" type="password" placeholder="Obavezno, ukoliko postavljate novu" />
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

            <div class="update-criminal-image" (click)="openFileInput('criminalRecordProof')">
              <mat-icon>image_search</mat-icon>
              <p class="azuriraj-neosudjivanost">Dodaj potvrdu o neosudjivanosti</p>
            </div>

            <div class="delete-profile" (click)="deleteProfile()">
            <mat-icon>delete</mat-icon>
              <p class="obrisi-nalog">Obriši nalog</p>
            </div>
            

          </div>
        <!-- Dodaj ovo u template -->
          <input 
            type="file" 
            id="profilePictureInput" 
            style="display: none;" 
            (change)="onFileSelected($event, 'profilePicture')" 
            accept="image/*" 
          />
          <input 
            type="file" 
            id="criminalRecordProofInput" 
            style="display: none;" 
            (change)="onFileSelected($event, 'criminalRecordProof')" 
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: 60px; /* Ostavlja prostor za navbar na manjim ekranima */
  box-sizing: border-box;
}

.profile-content {
  background: linear-gradient(135deg, #FF204E, #00224D);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 30px;
  width: 35%;
  max-width: 400px; /* Ograničenje širine za veće ekrane */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.images-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 15px;
  width: 100%;
 
}

.avatar, .criminal-proof {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FF204E;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;

}

.avatar:hover, .criminal-proof:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
.avatar img, .criminal-proof img {
        width: 100%;
        height: 100%;
        object-fit: cover;
}

/* Stil za default prikaz kada nema slike */
.default-proof, .default-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FF204E;
}



h1, p {
  color: rgb(255, 255, 255);
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
  background: rgb(233, 25, 88);
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

.update-elements {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.update-icon, .update-profile-image, .update-criminal-image, .delete-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 5px;
  color: white;
  transition: transform 0.2s, color 0.3s;
}

.update-icon:hover mat-icon, 
.update-profile-image:hover mat-icon, 
.update-criminal-image:hover mat-icon, 
.delete-profile:hover mat-icon {
  transform: scale(1.1);
  color: #FF204E;
}

.update-icon:hover, 
.update-profile-image:hover, 
.update-criminal-image:hover, 
.delete-profile:hover {
  transform: scale(1.1);
  color: #FF204E;
}

.azuriraj-text, .azuriraj-profilnu, .azuriraj-neosudjivanost, .obrisi-nalog {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: #FF204E;
}

/* 📱 Responsivnost za manje ekrane */
@media (max-width: 768px) {
  .profile-container {
    height: auto;
    padding-top: 80px; /* Ostavlja dovoljno prostora ispod navbar-a */
  }

  .profile-content {
    width: 90%;
    max-width: 100%;
    padding: 20px;
  }

  .images-container {
    flex-direction: column;
    gap: 15px;
  }

  .avatar, .criminal-proof {
    width: 4rem;
    height: 4rem;
  }

  .logout-btn {
    width: 100%;
    text-align: center;
  }
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
        userId: user.id,
        fullName: this.dataForm.value.fullName ?  this.dataForm.value.fullName : user.fullName,
        location: this.dataForm.value.location ? this.dataForm.value.location : user.location,
        phoneNumber: this.dataForm.value.phoneNumber ? this.dataForm.value.phoneNumber : user.phoneNumber,
      };
      if (this.dataForm.value.oldPassword && this.dataForm.value.newPassword) {
        updatePayload.oldPassword = this.dataForm.value.oldPassword;
        updatePayload.newPassword = this.dataForm.value.newPassword;
      }
      this.store.dispatch(updateUser({ userId: user.id, updatedData: updatePayload }));
    });
  }

  openFileInput(type: 'profilePicture' | 'criminalRecordProof') {
    const fileInput = document.getElementById(`${type}Input`) as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event, type: 'profilePicture' | 'criminalRecordProof') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file, type);
    }
  }

  uploadFile(file: File, type: 'profilePicture' | 'criminalRecordProof') {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id.toString());
      const uploadService = type === 'profilePicture' 
        ? this.userService.uploadProfilePicture(formData)
        : this.userService.uploadCriminalRecord(formData);
      
      uploadService.subscribe({
        next: () => this.store.dispatch(loadUser({ userId: user.id })),
        error: (error) => console.error(`Greška pri uploadu ${type}:`, error)
      });
    });
  }

  OpenCriminalProof() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user?.criminalRecordProof) {
        const imageUrl = `http://localhost:3000/uploads/criminal-records/${user.criminalRecordProof}`;
        window.open(imageUrl, '_blank'); // Otvara sliku u novom tabu
      } else {
        console.warn('Korisnik nema potvrdu o neosuđivanosti.');
      }
    });
  }
  

  deleteProfile() {
    if (confirm("Da li ste sigurni da želite da obrišete svoj nalog? Ova akcija je nepovratna!")) {
      this.user$.pipe(take(1)).subscribe(user => {
        if (!user) return;
        this.store.dispatch(deleteUser({ userId: user.id }));
      });
    }
  }
}

