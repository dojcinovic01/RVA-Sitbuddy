import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../store/auth/auth.actions';
import { selectToken } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { selectUser } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Prijavi se</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <label for="email">E-adresa</label>
            <input id="email" formControlName="email" type="email" placeholder="Unesite vašu e-adresu" />
            <div *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched">
              Morate uneti e-adresu.
            </div>
          </div>

          <div class="input-group">
            <label for="password">Lozinka</label>
            <input id="password" formControlName="password" type="password" placeholder="Unesite vašu lozinku" />
            <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched">
              Morate uneti lozinku.
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid">Prijavi se</button>
          <p class="register-link">
            Nemate nalog? <a (click)="navigateToRegister()">Registrujte se</a>.
          </p>

        </form>
      </div>
    </div>
  `,
  styles: [
    `      
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #00224D, #FF204E);
      }

      .login-box {
        background: linear-gradient(135deg,#FF204E,#00224D);
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 350px;
        text-align: center;
      }

      h2 {
        font-family: 'Calibri', sans-serif;
        margin-bottom: 20px;
        font-size: 24px;
        color: rgba(0, 0, 0, 0.8);
      }

      .input-group {
        color: rgba(0, 0, 0, 0.8);
        margin-bottom: 15px;
        text-align: left;
      }

      label {
        font-family: 'Calibri', sans-serif;
        display: block;
        font-size: 20px;
        margin-bottom: 5px;
        color: rgba(0, 0, 0, 0.8);
      }

      input {
        font-family: 'Calibri', sans-serif;
        width: 94%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      input:focus {
        border-color: #667eea;
        outline: none;
      }

      button {
        font-family: 'Calibri', sans-serif; 
        width: 100%;
        padding: 10px;
        background-color:#FF204E;
        color: black;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;

      }

      button:hover {
        background-color: #A0153E;
      }

      button:disabled {
        background-color: #FF204E;
        cursor: not-allowed;
      }

      .register-link {
        font-family: 'Calibri', sans-serif;
        margin-top: 15px;
        font-size: 14px;
        color: black;
      }

      .register-link a {
        font-family: 'Calibri', sans-serif;
        color: #FF204E;
        cursor: pointer;
        text-decoration: underline;
      }

      .register-link a:hover {
        color: #A0153E;
      }

    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  $user!: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.select(selectToken).subscribe(token => {
      if (token) {
        this.router.navigate(['/home']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.store.dispatch(login(this.loginForm.value));
      this.$user = this.store.select(selectUser);
      console.log('User data:', this.$user);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
}