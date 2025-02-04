import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email" />
        <div *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched">
          Email is required.
        </div>

        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password" />
        <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched">
          Password is required.
        </div>

        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 300px;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      input {
        width: 100%;
        padding: 8px;
      }
      button {
        margin-top: 10px;
        padding: 8px;
        background-color: blue;
        color: white;
        border: none;
        cursor: pointer;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.store.dispatch(login(this.loginForm.value));
    }
  }
}
