import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectToken = createSelector(selectAuthState, state => state.token);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectAuthLoading = createSelector(selectAuthState, state => state.loading);