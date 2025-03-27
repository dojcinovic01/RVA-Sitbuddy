import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { login } from '../../../store/auth/auth.actions';
import { selectToken } from '../../../store/auth/auth.selectors';
import { selectUser } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user$!: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkUserAuthentication();
  }

  private checkUserAuthentication(): void {
    this.store.select(selectToken).subscribe(token => {
      if (token) {
        this.checkUserRoleAndRedirect();
      }
    });
  }

  private checkUserRoleAndRedirect(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user?.userType === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(login(this.loginForm.value));
      this.user$ = this.store.select(selectUser);
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}