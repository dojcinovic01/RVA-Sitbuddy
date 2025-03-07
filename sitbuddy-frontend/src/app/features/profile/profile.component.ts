import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable, take } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';
import { selectToken } from '../../store/auth/auth.selectors';
import { selectUser } from '../../store/user/user.selectors';
import { deleteUser, loadUser, updateUser } from '../../store/user/user.actions';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { ReviewComponent } from "../review/review.component";
import { FollowComponent } from "../follow/follow.component";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule, ReviewComponent, FollowComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<any>;
  token$: Observable<string | null>;
  dataForm: FormGroup;
  imageUrl = environment.imageUrl;
  profileUser$ = new BehaviorSubject<any>(null);
  isCurrentUser$: Observable<boolean> | undefined;
  isReviewAllowed$:Observable<boolean> | undefined;
  isFollowAllowed$:Observable<boolean> | undefined;

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
      fullName: ['', Validators.required ],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      hourlyRate: ['', Validators.min(0)]
    });
   
  }

  ngOnInit(): void {
    this.token$.pipe(take(1)).subscribe(token => {
      if (!token) this.router.navigate(['/login']);
    });
  
    this.route.paramMap.pipe(
      map(params => params.get('userId'))
    ).subscribe(userIdFromUrl => {
      this.user$.pipe(take(1)).subscribe(loggedInUser => {
        if (loggedInUser?.id === userIdFromUrl) {
          this.profileUser$.next(loggedInUser);
        } else if (userIdFromUrl) {
          this.userService.getUser(userIdFromUrl).pipe(take(1)).subscribe(user => {
            this.profileUser$.next(user);
          });
        }
      });
    });
  
    this.isCurrentUser$ = combineLatest([this.user$, this.profileUser$]).pipe(
      map(([currentUser, profileUser]) => currentUser?.id === profileUser?.id)
    );

    this.isReviewAllowed$ = combineLatest([this.user$, this.profileUser$]).pipe(
      map(([currentUser, profileUser]) => {
        if (!currentUser || !profileUser) return false; // Ako nema korisnika, nema recenzije
        return (
          currentUser.id !== profileUser.id &&
          currentUser.userType === 'parent' && 
          profileUser.userType === 'sitter'
        );
      })
    );

    this.isFollowAllowed$ = combineLatest([this.user$, this.profileUser$]).pipe(
      map(([currentUser, profileUser]) => currentUser?.id !== profileUser?.id)
    );
    
    this.isCurrentUser$.subscribe(isCurrent => {
      if (isCurrent) {
        this.dataForm.enable();
      } else {
        this.dataForm.disable();
      }
    });

    this.user$.subscribe(updatedUser => {
      this.isCurrentUser$?.pipe(take(1)).subscribe(isCurrent => {
        if (isCurrent) {
          this.profileUser$.next(updatedUser);
        }
      });
    });
    
  }
  
  

  updateData() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;
  
      const updatedData = {
        fullName: this.dataForm.value.fullName || user.fullName,
        location: this.dataForm.value.location || user.location,
        phoneNumber: this.dataForm.value.phoneNumber || user.phoneNumber,
        email: this.dataForm.value.email || user.email,
        hourlyRate: this.dataForm.value.hourlyRate || user.hourlyRate,
        ...(this.dataForm.value.oldPassword && this.dataForm.value.newPassword && {
          oldPassword: this.dataForm.value.oldPassword,
          newPassword: this.dataForm.value.newPassword
        })
      };
  
      this.store.dispatch(updateUser({ userId: user.id, updatedData }));
    });
  }
  

  openFileInput(type: 'profilePicture' | 'criminalRecordProof') {
    this.isCurrentUser$?.pipe(take(1)).subscribe(isCurrent => {
      if (isCurrent) {
        const fileInput = document.getElementById(`${type}Input`) as HTMLInputElement;
        fileInput.click();
      } else {
        this.profileUser$.pipe(take(1)).subscribe(profileUser => {
          if (profileUser?.[type]) {
            const imageUrl = `${this.imageUrl}/${type === 'profilePicture' ? 'profile-pictures' : 'criminal-records'}/${profileUser[type]}`;
            window.open(imageUrl, '_blank'); // Otvara sliku u novom tabu
          } else {
            alert(`Korisnik nema ${type === 'profilePicture' ? 'profilnu sliku' : 'potvrdu o neosuđivanosti'}.`);
          }
        });
      }
    });
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
    this.profileUser$.pipe(take(1)).subscribe(profileUser => {
      if (profileUser?.criminalRecordProof) {
        const imageUrl = `${this.imageUrl}/criminal-records/${profileUser.criminalRecordProof}`;
        window.open(imageUrl, '_blank'); 
      } else {
        alert('Korisnik nema potvrdu o neosuđivanosti.');
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

  deleteCriminalProof(){
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;
      this.userService.deleteCriminalProof(user.id).subscribe({
        next: () => this.store.dispatch(loadUser({ userId: user.id })),
        error: (error: any) => console.error('Greška pri brisanju potvrde o neosuđivanosti:', error)
      });
    });
  }
}
