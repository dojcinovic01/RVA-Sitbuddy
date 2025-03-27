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
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
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
