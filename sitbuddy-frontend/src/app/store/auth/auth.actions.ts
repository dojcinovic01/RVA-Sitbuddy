import { createAction, props } from '@ngrx/store';

const AUTH_PREFIX = '[Auth]';

export const login = createAction(`${AUTH_PREFIX} Login`, props<{ email: string; password: string }>());
export const loginSuccess = createAction(`${AUTH_PREFIX} Login Success`, props<{ token: string }>());
export const loginFailure = createAction(`${AUTH_PREFIX} Login Failure`, props<{ error: string }>());
export const logout = createAction(`${AUTH_PREFIX} Logout`);

export const register = createAction(
  `${AUTH_PREFIX} Register`,
  props<{ fullName: string; email: string; password: string; location: string; phoneNumber: string; userType: 'parent' | 'sitter'; hourlyRate?: number }>()
);
export const registerSuccess = createAction(`${AUTH_PREFIX} Register Success`);
export const registerFailure = createAction(`${AUTH_PREFIX} Register Failure`, props<{ error: string }>());
export const checkAuthStatus = createAction(`${AUTH_PREFIX} Check Auth Status`);
