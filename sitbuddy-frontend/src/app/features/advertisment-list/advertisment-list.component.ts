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
import { environment } from '../../../environments/environment';

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
  private imagesUrl = `${environment.imageUrl}`;

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
      width: '400px',
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
    return profilePicture ? `${this.imagesUrl+'/profile-pictures/'}${profilePicture}` : this.imagesUrl+ '/profile-pictures/default-profile.png';
  }

  getUserTypeLabel(userType?: string): string {
    return userType === 'parent' ? 'Roditelj' : 'Sitter';
  }

  getRatingDisplay(rating?: number): string {
    return rating?.toFixed(1) ?? 'N/A';
  }
}