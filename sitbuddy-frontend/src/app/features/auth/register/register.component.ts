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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
