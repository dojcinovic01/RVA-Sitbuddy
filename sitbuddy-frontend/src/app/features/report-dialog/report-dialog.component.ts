import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment';

enum ReportType {
  ADVERTISEMENT = 'advertisment',
  USER = 'user',
  REVIEW = 'review'
}

const REPORT_API_URL = `${environment.apiUrl}/reports`;

interface ReportDialogData {
  type: ReportType;
  adId?: number;
  reviewId?: number;
  reportedUserId?: number;
  entityTitle?: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {
  public MIN_REASON_LENGTH = 5;
  reportForm: FormGroup;
  readonly title: string;
  readonly reportTitles: Record<ReportType, string> = {
    [ReportType.ADVERTISEMENT]: 'Prijavi oglas',
    [ReportType.USER]: 'Prijavi korisnika',
    [ReportType.REVIEW]: 'Prijavi recenziju'
  };

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportDialogData,
    private http: HttpClient
  ) {
    this.reportForm = this.createReportForm();
    this.title = this.getTitle();
  }

  private createReportForm(): FormGroup {
    return new FormGroup({
      reason: new FormControl('', [
        Validators.required,
        Validators.minLength(this.MIN_REASON_LENGTH)
      ])
    });
  }

  private getTitle(): string {
    return this.reportTitles[this.data.type] || 'Prijava';
  }

  private getReportPayload(): Record<string, unknown> {
    const { type, adId, reviewId, reportedUserId } = this.data;
    console.log('Report data:', this.data);
    return {
      type,
      reportedUserId,
      reason: this.reportForm.value.reason,
      ...(type === ReportType.ADVERTISEMENT && { reportedAdvertismentId: adId }),
      ...(type === ReportType.REVIEW && { reportedReviewId: reviewId })
    };
  }

  submitReport(): void {
    if (this.reportForm.invalid) {
      return;
    }

    const reportData = this.getReportPayload();
    console.log('Prijava poslana:', reportData);

    this.http.post(REPORT_API_URL, reportData).subscribe({
      next: () => this.dialogRef.close(reportData),
      error: (err) => this.handleReportError(err)
    });
  }

  private handleReportError(error: any): void {
    console.error('Greška pri slanju prijave', error);
    // Potencijalno dodati notifikaciju korisniku
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}