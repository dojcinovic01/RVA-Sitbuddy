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
          <div class="form-columns">
            <div class="form-column">
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
            </div>
            
            <div class="form-column">
              <div class="input-group">
                <label for="location">Lokacija</label>
                <input id="location" formControlName="location" type="text" placeholder="Primer: Bulevar Kralja Aleksandra 73, Beograd, Srbija" />
              </div>

              <div class="input-group">
                <label for="phoneNumber">Broj telefona</label>
                <input id="phoneNumber" formControlName="phoneNumber" type="tel" placeholder="Unesite vaš broj telefona" />
              </div>

              <div class="input-group">
                <label for="userType">Tip korisnika</label>
                <select id="userType" formControlName="userType" (change)="onUserTypeChange()">
                  <option value="" disabled>Izaberite </option>
                  <option value="parent">Roditelj</option>
                  <option value="sitter">Siter</option>
                </select>
              </div>
              
              <div class="input-group" *ngIf="isSitter">
                <label for="hourlyRate">Cena po satu (RSD)</label>
                <input id="hourlyRate" formControlName="hourlyRate" type="number" placeholder="Unesite cenu po satu" />
              </div>
            </div>
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
      padding: 40px;
      border-radius: 10px;
      
      width: 100%;
      max-width: 600px;
      text-align: center;
    }

    .form-columns {
      display: flex;
      justify-content: space-between;
      gap: 50px;
    }

    .form-column {
      flex: 1;
    }

    .input-group {
      text-align: left;
      margin-bottom: 15px;
    }

    label {
      display: block;
      font-size: 16px;
      margin-bottom: 5px;
    }

    input, select {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      
    }

    button {
      width: 100%;
      padding: 8px;
      background-color: #FF204E;
      color: black;
      border-radius: 5px;
    }

    button:disabled {
      background-color: #FF204E;
      cursor: not-allowed;
    }

    button:enabled{
      cursor: pointer;
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
    `
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSitter = false;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      userType: ['', Validators.required],
      hourlyRate: [{ value: null, disabled: true }, Validators.min(0)]
    });
  }

  onUserTypeChange() {
    this.isSitter = this.registerForm.value.userType === 'sitter';
    if (this.isSitter) {
      this.registerForm.get('hourlyRate')?.enable();
      this.registerForm.get('hourlyRate')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.registerForm.get('hourlyRate')?.disable();
      this.registerForm.get('hourlyRate')?.clearValidators();
    }
    this.registerForm.get('hourlyRate')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      if (formValue.password !== formValue.confirmPassword) {
        alert("Lozinke se ne podudaraju!");
        return;
      }
      this.store.dispatch(register(formValue));
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
