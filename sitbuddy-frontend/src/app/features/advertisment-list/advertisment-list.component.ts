import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Advertisment, User } from '../../store/advertisment/advertisment.state';
import * as AdvertismentActions from '../../store/advertisment/advertisment.actions';
import { selectAllAdvertisments } from '../../store/advertisment/advertisment.selectors';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

const DIALOG_WIDTH = '400px';
const DEFAULT_PROFILE_IMAGE = 'http://localhost:3000/uploads/profile-pictures/default-profile.png';
const PROFILE_IMAGE_BASE = 'http://localhost:3000/uploads/profile-pictures/';

@Component({
  selector: 'app-advertisment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './advertisment-list.component.html',
  styleUrls: ['./advertisment-list.component.scss']
})
export class AdvertismentListComponent implements OnInit {
  @Input() user?: User | null;
  advertisments$: Observable<Advertisment[]>;

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.advertisments$ = this.store.select(selectAllAdvertisments);
  }

  ngOnInit(): void {
    this.loadInitialAdvertisments();
  }

  private loadInitialAdvertisments(): void {
    this.store.dispatch(AdvertismentActions.loadAdvertisments());
    this.logCurrentAdvertisments();
  }

  private logCurrentAdvertisments(): void {
    this.advertisments$.subscribe(ads => console.log('Trenutni oglasi:', ads));
  }

  loadAllAds(): void {
    this.store.dispatch(AdvertismentActions.loadAdvertisments());
  }

  loadFollowedAds(): void {
    if (this.user?.id) {
      this.store.dispatch(AdvertismentActions.loadFollowedAdvertisments({ 
        userId: this.user.id 
      }));
    }
  }

  loadTopRatedAds(): void {
    this.store.dispatch(AdvertismentActions.loadTopRatedAdvertisments());
  }

  loadCriminalProofAds(): void {
    this.store.dispatch(AdvertismentActions.loadCriminalProofAdvertisments());
  }

  navigateToProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  openReportDialog(
    adId: number, 
    reportedUserId: number, 
    adTitle: string, 
    event: MouseEvent
  ): void {
    event.stopPropagation();
    this.showReportDialog(adId, reportedUserId, adTitle);
  }

  private showReportDialog(
    adId: number, 
    reportedUserId: number, 
    adTitle: string
  ): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: DIALOG_WIDTH,
      data: this.createReportDialogData(adId, reportedUserId, adTitle)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log('Prijava oglasa poslana:', result);
    });
  }

  private createReportDialogData(
    adId: number, 
    reportedUserId: number, 
    adTitle: string
  ): { type: string; adId: number; reportedUserId: number; entityTitle: string } {
    return { 
      type: 'advertisment', 
      adId, 
      reportedUserId, 
      entityTitle: adTitle 
    };
  }

  getProfileImage(profilePicture?: string): string {
    return profilePicture ? `${PROFILE_IMAGE_BASE}${profilePicture}` : DEFAULT_PROFILE_IMAGE;
  }

  getUserTypeLabel(userType?: string): string {
    return userType === 'parent' ? 'Roditelj' : 'Sitter';
  }

  getRatingDisplay(rating?: number): string {
    return rating?.toFixed(1) ?? 'N/A';
  }
}