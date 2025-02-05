import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { register } from '../../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <label for="name">Name</label>
            <input id="name" formControlName="name" type="text" placeholder="Enter your name" />
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input id="email" formControlName="email" type="email" placeholder="Enter your email" />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input id="password" formControlName="password" type="password" placeholder="Enter your password" />
          </div>

          <div class="input-group">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" formControlName="confirmPassword" type="password" placeholder="Confirm your password" />
          </div>

          <div class="input-group">
            <label for="location">Location</label>
            <input id="location" formControlName="location" type="text" placeholder="Enter your location" />
          </div>

          <div class="input-group">
            <label for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" formControlName="phoneNumber" type="tel" placeholder="Enter your phone number" />
          </div>

          <div class="input-group">
            <label for="userType">User Type</label>
            <select id="userType" formControlName="userType">
              <option value="" disabled>Select User Type</option>
              <option value="parent">Parent</option>
              <option value="babysitter">Babysitter</option>
            </select>
          </div>

          <button type="submit" [disabled]="registerForm.invalid">Register</button>

          <p class="login-link">
            Vec imate nalog? <a (click)="navigateToLogin()">Prijavi se</a>.
          </p>

        </form>
      </div>
    </div>
  `,
    styles: [
  `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #00224D, #FF204E);
      padding: 20px;
    }

    .register-box {
      background: linear-gradient(135deg, #FF204E, #00224D);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 300px; /* Smanjen max-width */
      text-align: center;
    }

    h2 {
      font-size: 22px; /* Smanjena veličina naslova */
      margin-bottom: 15px;
      color: rgba(0, 0, 0, 0.8);
    }

    .input-group {
      text-align: left;
      margin-bottom: 15px; /* Smanjen razmak između polja */
    }

    label {
      display: block;
      font-family: 'Calibri', sans-serif;
      font-size: 14px; /* Smanjena veličina teksta */
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 5px;
    }

    input, select {
      width: 90%;
      padding: 8px; /* Smanjen padding */
      font-size: 14px; /* Smanjena veličina teksta */
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      width: 100%;
      padding: 8px; /* Smanjen padding */
      background-color: #FF204E;
      color: black;
      font-size: 14px; /* Smanjena veličina teksta */
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background-color: #A0153E;
    }

    @media (max-width: 400px) {
      .register-box {
        max-width: 200px; /* Još kompaktnije za male ekrane */
        padding: 15px;
      }

      input, select, button {
        font-size: 13px;
        padding: 6px;
      }
    }

    .login-link {
        margin-top: 15px;
        font-size: 14px;
        color: black;
      }

      .login-link a {
        color: #FF204E;
        cursor: pointer;
        text-decoration: underline;
      }

      .login-link a:hover {
        color: #A0153E;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      userType: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, confirmPassword, location, phoneNumber, userType } = this.registerForm.value;
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      this.store.dispatch(register({ name, email, password, location, phoneNumber, userType }));
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
