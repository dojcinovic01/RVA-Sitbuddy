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
        <h2>Registruj se</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <label for="fullName">Ime i prezime</label>
            <input id="fullName" formControlName="fullName" type="text" placeholder="Unesi svoje ime i prezime" />
          </div>

          <div class="input-group">
            <label for="email">E-adresa</label>
            <input id="email" formControlName="email" type="email" placeholder="Unesite e-adresu" />
          </div>

          <div class="input-group">
            <label for="password">Lozinka</label>
            <input id="password" formControlName="password" type="password" placeholder="Unesite vašu lozinku (više od 5 karaktera)" />
          </div>

          <div class="input-group">
            <label for="confirmPassword">Potvrdite lozinku</label>
            <input id="confirmPassword" formControlName="confirmPassword" type="password" placeholder="Potvrdite lozinku" />
          </div>

          <div class="input-group">
            <label for="location">Lokacija</label>
            <input id="location" formControlName="location" type="text" placeholder="Unesite vašu lokaciju" />
          </div>

          <div class="input-group">
            <label for="phoneNumber">Broj telefona</label>
            <input id="phoneNumber" formControlName="phoneNumber" type="tel" placeholder="Unesite vaš broj telefona" />
          </div>

          <div class="input-group">
            <label for="userType">Tip korisnika</label>
            <select id="userType" formControlName="userType">
              <option value="" disabled>Izaberite </option>
              <option value="parent">Roditelj</option>
              <option value="sitter">Siter</option>
            </select>
          </div>

          <button type="submit" [disabled]="registerForm.invalid">Registruj se</button>

          <p class="login-link">
            Već imate nalog? <a (click)="navigateToLogin()">Prijavi se</a>.
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
      padding: 10px;
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
      font-family: 'Calibri', sans-serif;
      font-size: 22px; /* Smanjena veličina naslova */
      margin-bottom: 15px;
      color: rgba(0, 0, 0, 0.8);
    }

    .input-group {
      font-family: 'Calibri', sans-serif;
      text-align: left;
      margin-bottom: 15px; /* Smanjen razmak između polja */
    }

    label {
      display: block;
      font-family: 'Calibri', sans-serif;
      font-size: 16px; /* Smanjena veličina teksta */
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 5px;
    }

    input{
      font-family: 'Calibri', sans-serif;
      width: 90%;
      padding: 10px; /* Smanjen padding */
      font-size: 16px; /* Smanjena veličina teksta */
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    select{
      font-family: 'Calibri', sans-serif;
      width: 100%;
      padding: 10px; /* Smanjen padding */
      font-size: 16px; /* Smanjena veličina teksta */
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
        font-family: 'Calibri', sans-serif;
        font-size: 16px;
        padding: 10px;
      }
    }
    button:disabled {
        background-color: #FF204E;
        cursor: not-allowed;
      }

    .login-link {
        font-family: 'Calibri', sans-serif;
        margin-top: 15px;
        font-size: 14px;
        color: black;
      }

      .login-link a {
        font-family: 'Calibri', sans-serif;
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
      fullName: ['', Validators.required],
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
      const { fullName, email, password, confirmPassword, location, phoneNumber, userType } = this.registerForm.value;
      if (password !== confirmPassword) {
        alert("Lozinke se ne podudaraju!");
        return;
      }

      this.store.dispatch(register({ fullName, email, password, location, phoneNumber, userType }));
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
