import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {
  reportForm: FormGroup;
  title: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; adId?: number; reviewId?: number; reportedUserId?: number; entityTitle?: string },
    private http: HttpClient
  ) {
    this.reportForm = new FormGroup({
      reason: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    this.setTitle();
  }

  setTitle() {
    switch (this.data.type) {
      case 'advertisment':
        this.title = `Prijavi oglas:`;
        break;
      case 'user':
        this.title = `Prijavi korisnika`;
        break;
      case 'review':
        this.title = `Prijavi recenziju`;
        break;
      default:
        this.title = 'Prijava';
    }
  }

  submitReport(): void {
    if (this.reportForm.valid) {
      const reportData: any = {
        type: this.data.type,
        reportedUserId: this.data.reportedUserId,
        reason: this.reportForm.value.reason
      };

      if (this.data.type === 'advertisment') {
        reportData.reportedAdvertismentId = this.data.adId;
      } else if (this.data.type === 'review') {
        reportData.reportedReviewId = this.data.reviewId;
      }

      console.log('Prijava poslana:', reportData);

      this.http.post(`${environment.apiUrl}/reports`, reportData).subscribe({
        next: () => {
          this.dialogRef.close(reportData);
        },
        error: (err) => {
          console.error('Greška pri slanju prijave', err);
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
