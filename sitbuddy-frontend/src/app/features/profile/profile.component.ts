import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, combineLatest, EMPTY, Observable, of, switchMap, take } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';

import { selectToken } from '../../store/auth/auth.selectors';
import { selectUser } from '../../store/user/user.selectors';
import { deleteUser, loadUser, updateUser } from '../../store/user/user.actions';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { ReviewComponent } from "../review/review.component";
import { FollowComponent } from "../follow/follow.component";
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

enum FileType {
  PROFILE_PICTURE = 'profilePicture',
  CRIMINAL_RECORD = 'criminalRecordProof'
}

export enum ImagePath {
  PROFILE_PICTURE = 'profile-pictures',
  CRIMINAL_RECORD = 'criminal-records'
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, MatIconModule, ReactiveFormsModule, ReviewComponent, FollowComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public readonly imageUrl = environment.imageUrl;
  public FileType = FileType;
  public ImagePath = ImagePath;
  
  user$: Observable<any>;
  token$: Observable<string | null>;
  dataForm: FormGroup;
  profileUser$ = new BehaviorSubject<any>(null);
  isCurrentUser$: Observable<boolean>;
  isReviewAllowed$: Observable<boolean>;
  isFollowAllowed$: Observable<boolean>;


  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.user$ = this.store.select(selectUser);
    this.token$ = this.store.select(selectToken);
    this.dataForm = this.createForm();
    
    // Use arrow functions to maintain 'this' context
    this.isCurrentUser$ = this.createBooleanObservable((currentUser, profileUser) => this.isSameUser(currentUser, profileUser));
    this.isReviewAllowed$ = this.createBooleanObservable((currentUser, profileUser) => this.canReview(currentUser, profileUser));
    this.isFollowAllowed$ = this.createBooleanObservable((currentUser, profileUser) => this.canFollow(currentUser, profileUser));
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadProfileUser();
    this.handleFormState();
    this.updateProfileOnUserChange();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      hourlyRate: ['', Validators.min(0)]
    });
  }

  private checkAuthentication(): void {
    this.token$.pipe(take(1)).subscribe(token => {
      if (!token) this.router.navigate(['/login']);
    });
  }

  private loadProfileUser(): void {
    this.route.paramMap.pipe(
      map(params => params.get('userId')),
      switchMap(userIdFromUrl => this.getUserComparison(userIdFromUrl)),
      switchMap(({ loggedInUser, userIdFromUrl }) => this.handleUserLoading(loggedInUser, userIdFromUrl))
    ).subscribe(user => {
      if (user) this.profileUser$.next(user);
    });
  }

  private getUserComparison(userIdFromUrl: string | null): Observable<{ loggedInUser: any, userIdFromUrl: string | null }> {
    return this.user$.pipe(
      take(1),
      map(loggedInUser => ({ loggedInUser, userIdFromUrl }))
    );
  }

  private handleUserLoading(loggedInUser: any, userIdFromUrl: string | null): Observable<any> {
    if (this.isSameUser(loggedInUser, { id: userIdFromUrl })) {
      this.profileUser$.next(loggedInUser);
      return of(null);
    }
    return userIdFromUrl ? this.userService.getUser(userIdFromUrl) : of(null);
  }

  private handleFormState(): void {
    this.isCurrentUser$.subscribe(isCurrent => {
      isCurrent ? this.dataForm.enable() : this.dataForm.disable();
    });
  }

  private updateProfileOnUserChange(): void {
    this.user$.subscribe(updatedUser => {
      this.isCurrentUser$?.pipe(take(1)).subscribe(isCurrent => {
        if (isCurrent) this.profileUser$.next(updatedUser);
      });
    });
  }

  private isSameUser = (currentUser: any, profileUser: any): boolean => {
    return currentUser?.id === profileUser?.id;
  }
  
  private canReview = (currentUser: any, profileUser: any): boolean => {
    return !this.isSameUser(currentUser, profileUser) &&
      currentUser?.userType === 'parent' &&
      profileUser?.userType === 'sitter';
  }
  
  private canFollow = (currentUser: any, profileUser: any): boolean => {
    return !this.isSameUser(currentUser, profileUser);
  }

  private createBooleanObservable(condition: (currentUser: any, profileUser: any) => boolean): Observable<boolean> {
    return combineLatest([this.user$, this.profileUser$]).pipe(
      map(([currentUser, profileUser]) => condition(currentUser, profileUser))
    );
  }

  updateData(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;

      const updatedData = this.prepareUpdateData(user);
      this.store.dispatch(updateUser({ userId: user.id, updatedData }));
    });
  }

  private prepareUpdateData(user: any): any {
    return {
      fullName: this.dataForm.value.fullName || user.fullName,
      location: this.dataForm.value.location || user.location,
      phoneNumber: this.dataForm.value.phoneNumber || user.phoneNumber,
      email: this.dataForm.value.email || user.email,
      hourlyRate: this.dataForm.value.hourlyRate || user.hourlyRate,
      ...this.getPasswordUpdatesIfProvided()
    };
  }

  private getPasswordUpdatesIfProvided(): { oldPassword: string, newPassword: string } | {} {
    return this.dataForm.value.oldPassword && this.dataForm.value.newPassword
      ? {
          oldPassword: this.dataForm.value.oldPassword,
          newPassword: this.dataForm.value.newPassword
        }
      : {};
  }

  openFileInput(type: FileType): void {
    this.isCurrentUser$?.pipe(take(1)).subscribe(isCurrent => {
      isCurrent 
        ? this.triggerFileInput(type)
        : this.handleFileViewing(type);
    });
  }

  private triggerFileInput(type: FileType): void {
    const fileInput = document.getElementById(`${type}Input`) as HTMLInputElement;
    fileInput.click();
  }

  private handleFileViewing(type: FileType): void {
    this.profileUser$.pipe(take(1)).subscribe(profileUser => {
      if (profileUser?.[type]) {
        const path = type === FileType.PROFILE_PICTURE ? ImagePath.PROFILE_PICTURE : ImagePath.CRIMINAL_RECORD;
        const imageUrl = `${this.imageUrl}/${path}/${profileUser[type]}`;
        window.open(imageUrl, '_blank');
      } else {
        alert(this.getFileNotFoundMessage(type));
      }
    });
  }

  private getFileNotFoundMessage(type: FileType): string {
    return type === FileType.PROFILE_PICTURE
      ? 'Korisnik nema profilnu sliku'
      : 'Korisnik nema potvrdu o neosuđivanosti';
  }

  onFileSelected(event: Event, type: FileType): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) this.uploadFile(file, type);
  }

  private uploadFile(file: File, type: FileType): void {
    this.user$.pipe(
      take(1),
      switchMap(user => user ? this.processFileUpload(file, type, user) : of(null))
    ).subscribe(userId => {
      if (userId) this.store.dispatch(loadUser({ userId }));
    });
  }

  private processFileUpload(file: File, type: FileType, user: any): Observable<string | null> {
    const formData = this.createFormData(file, user.id);
    const uploadService = type === FileType.PROFILE_PICTURE
      ? this.userService.uploadProfilePicture(formData)
      : this.userService.uploadCriminalRecord(formData);

    return uploadService.pipe(
      map(() => user.id),
      catchError(error => this.handleUploadError(error))
    );
  }

  private createFormData(file: File, userId: number): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return formData;
  }

  private handleUploadError(error: any): Observable<never> {
    console.error('Greška pri uploadu:', error);
    const errorMessage = error.status === 400
      ? error.error.message || "Uverenje nije validno! Pokušajte ponovo."
      : "Došlo je do greške! Molimo Vas pokušajte ponovo.";
    alert(errorMessage);
    return EMPTY;
  }

  deleteProfile(): void {
    if (confirm("Da li ste sigurni da želite da obrišete svoj nalog? Ova akcija je nepovratna!")) {
      this.user$.pipe(take(1)).subscribe(user => {
        if (user) this.store.dispatch(deleteUser({ userId: user.id }));
      });
    }
  }

  deleteCriminalProof(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userService.deleteCriminalProof(user.id).subscribe({
          next: () => this.store.dispatch(loadUser({ userId: user.id })),
          error: (error: any) => console.error('Greška pri brisanju potvrde o neosuđivanosti:', error)
        });
      }
    });
  }

  openReportDialog(event: MouseEvent): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { type: 'user', reportedUserId: this.profileUser$.value.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log('Prijava profila poslana:', result);
    });
  }
}