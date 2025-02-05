import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const loadAuthState = createAction('[Auth] Load Auth State');

export const register = createAction(
  '[Auth] Register',
  props<{ 
    name: string; 
    email: string; 
    password: string; 
    location: string; 
    phoneNumber: string; 
    userType: 'parent' | 'babysitter'; // Umesto `any`, koristi konkretne vrednosti
  }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: any; token: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);


export const logout = createAction('[Auth] Logout');
