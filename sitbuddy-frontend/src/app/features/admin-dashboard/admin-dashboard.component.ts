import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
    <h1>Admin Dashboard</h1>
    <nav>
      <button (click)="activeTab = 'profiles'">Profili</button>
      <button (click)="activeTab = 'ads'">Oglasi</button>
      <button (click)="activeTab = 'reviews'">Recenzije</button>
    </nav>
    <div *ngIf="activeTab === 'profiles'">Lista profila</div>
    <div *ngIf="activeTab === 'ads'">Lista oglasa</div>
    <div *ngIf="activeTab === 'reviews'">Lista recenzija</div>
  `,
  styles: [`
    h1 { text-align: center; }
    nav { display: flex; justify-content: center; gap: 10px; }
    button { padding: 10px; cursor: pointer; }
  `]
})
export class AdminDashboardComponent {
  activeTab: 'profiles' | 'ads' | 'reviews' = 'profiles';
}
