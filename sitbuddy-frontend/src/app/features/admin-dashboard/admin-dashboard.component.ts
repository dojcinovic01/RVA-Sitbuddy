import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { NavbarComponent } from "../navbar/navbar.component";
import { Report, ReportType } from '../../store/report/report.state';
import { loadReports, deleteReport, deleteReportedContent } from '../../store/report/report.actions';
import { selectReports, selectReportsLoading, selectReportsError } from '../../store/report/report.selectors';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  template: `
  <app-navbar></app-navbar>
  <div class="dashboard-container">
    <h1>Admin Dashboard</h1>
    
    <nav class="tabs">
      <button [class.active]="activeTab === 'profiles'" (click)="setActiveTab('profiles')">Profili</button>
      <button [class.active]="activeTab === 'ads'" (click)="setActiveTab('ads')">Oglasi</button>
      <button [class.active]="activeTab === 'reviews'" (click)="setActiveTab('reviews')">Recenzije</button>
    </nav>

    <div *ngIf="activeTab === 'profiles'">
      <h2>Prijavljeni Profili</h2>
      <div class="loading" *ngIf="loading$ | async">Učitavanje...</div>
      <div class="error" *ngIf="error$ | async as error">❌ {{ error }}</div>
      <div class="reports-container">
        <div class="report-card" *ngFor="let report of reports$ | async">
          <p>Razlog prijave: <strong>{{ report.reason }}</strong></p>
          <p>
            Korisnik: 
            <span class="profile-link" (click)="navigateToProfile(report.reportedUser?.id)">
              {{ report.reportedUser?.fullName }}
            </span>
          </p>
          <div class="actions">
            <button class="delete" (click)="removeReport(report.id)">Obriši prijavu</button>
            <button class="warn" (click)="removeReportedContent(report)">Obriši prijavljeni sadržaj</button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="activeTab === 'ads'">
      <h2>Prijavljeni Oglasi</h2>
      <div class="loading" *ngIf="loading$ | async">Učitavanje...</div>
      <div class="error" *ngIf="error$ | async as error">❌ {{ error }}</div>
      <div class="reports-container">
        <div class="report-card" *ngFor="let report of reports$ | async">
          <p>Razlog prijave: <strong>{{ report.reason }}</strong></p>
          <p>Naslov oglasa: <span class="highlight">{{ report.reportedAdvertisment?.title }}</span></p>
          <p>Oglas: <span class="highlight">{{ report.reportedAdvertisment?.description }}</span></p>
          <div class="actions">
            <button class="delete" (click)="removeReport(report.id)">Obriši prijavu</button>
            <button class="warn" (click)="removeReportedContent(report)">Obriši prijavljeni sadržaj</button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="activeTab === 'reviews'">
      <h2>Prijavljene Recenzije</h2>
      <div class="loading" *ngIf="loading$ | async">Učitavanje...</div>
      <div class="error" *ngIf="error$ | async as error">❌ {{ error }}</div>
      <div class="reports-container">
        <div class="report-card" *ngFor="let report of reports$ | async">
        <p>Razlog prijave: <strong>{{ report.reason }}</strong></p>
          <p>Prijavljena recenzija: <span class="highlight">{{ report.reportedReview?.comment }}</span></p>
          <div class="actions">
            <button class="delete" (click)="removeReport(report.id)">Obriši prijavu</button>
            <button class="warn" (click)="removeReportedContent(report)">Obriši prijavljeni sadržaj</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .dashboard-container {
  max-width: 70%;
  margin: auto;
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #00224D, #FF204E);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: white;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 12px 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #FF204E, #ff7b00);
  color: white;
  transition: 0.3s ease;
}

.tabs button.active {
  background: linear-gradient(135deg, #007bff, #00d4ff);
}

.tabs button:hover {
  opacity: 0.8;
}

.reports-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.report-card {
  background: linear-gradient(135deg, #FF204E, #00224D);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
  width: 80%;
  color: white;
  gap: 25px;
  margin-top: 15px;
}

.report-card:hover {
  transform: translateY(-3px);
}

.profile-link {
  color: #00d4ff;
  cursor: pointer;
  font-weight: bold;
}

.profile-link:hover {
  text-decoration: underline;
}

.highlight {
  color: #ff7b00;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.actions button {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: 0.3s;
}

.delete {
  background: linear-gradient(135deg, #ff4d4d, #ff0000);
  color: white;
}

.delete:hover {
  background: linear-gradient(135deg, #d43d3d, #b30000);
}

.warn {
  background: linear-gradient(135deg, #ffa500, #ff4500);
  color: white;
}

.warn:hover {
  background: linear-gradient(135deg, #cc8400, #cc3700);
}

.loading {
  font-weight: bold;
  color: #00d4ff;
}

.error {
  font-weight: bold;
  color: #ff4d4d;
}

  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'profiles' | 'ads' | 'reviews' = 'profiles';
  reports$: Observable<Report[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store, private router: Router) {
    this.reports$ = this.store.select(selectReports);
    this.loading$ = this.store.select(selectReportsLoading);
    this.error$ = this.store.select(selectReportsError);
  }

  ngOnInit() { 
    this.loadReports();
  }

  setActiveTab(tab: 'profiles' | 'ads' | 'reviews') {
     this.activeTab = tab; this.loadReports(); 
  }

  loadReports() {
    let type: ReportType;
    if (this.activeTab === 'profiles') type = ReportType.USER;
    else if (this.activeTab === 'ads') type = ReportType.ADVERTISMENT;
    else type = ReportType.REVIEW;
  
    this.store.dispatch(loadReports({ reportType: type }));
  }
  
  removeReport(reportId: number) {
     this.store.dispatch(deleteReport({ reportId })); 
  }
  removeReportedContent(report: Report) {
     this.store.dispatch(deleteReportedContent({ report })); 
  }
  navigateToProfile(userId?: number) {
     this.router.navigate(['/profile', userId]); 
  }
}
