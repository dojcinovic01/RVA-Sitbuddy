import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';
import { selectToken } from '../../store/auth/auth.selectors';
import { selectUser } from '../../store/user/user.selectors';
import { deleteUser, loadUser, updateUser } from '../../store/user/user.actions';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<any>;
  token$: Observable<string | null>;
  dataForm: FormGroup;
  imageUrl = environment.imageUrl;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.user$ = this.store.select(selectUser);
    this.token$ = this.store.select(selectToken);
    this.dataForm = this.fb.group({
      fullName: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    this.token$.pipe(take(1)).subscribe(token => {
      console.log('Token:', token);
      if (!token) this.router.navigate(['/login']);
    });

    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        this.store.dispatch(loadUser({ userId }));
      }
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
        const imageUrl = `${this.imageUrl}/criminal-records/${user.criminalRecordProof}`;
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
