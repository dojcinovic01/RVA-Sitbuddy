import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const register = createAction(
  '[Auth] Register',
  props<{ 
    fullName: string; 
    email: string; 
    password: string; 
    location: string; 
    phoneNumber: string; 
    userType: 'parent' | 'sitter'; 
    hourlyRate?: number;
  }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success'
);


export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const checkAuthStatus = createAction('[Auth] Check Auth Status');


