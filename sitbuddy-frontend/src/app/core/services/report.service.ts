import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report, ReportType } from '../../store/report/report.state';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private API_URL = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getReportsByType(type: ReportType): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.API_URL}/type/${type}`);
  }

  deleteReport(reportId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${reportId}`);
  }

  deleteReportedContent(reportId:number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${reportId}/content`);
  }
}
