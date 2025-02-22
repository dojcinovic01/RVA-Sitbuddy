import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdvertismentState } from './advertisment.state';

export const selectAdvertismentState = createFeatureSelector<AdvertismentState>('advertisment');

export const selectAllAdvertisments = createSelector(selectAdvertismentState, (state) => state.advertisments);
export const selectUserAdvertisment = createSelector(selectAdvertismentState, (state) => state.userAdvertisment);
export const selectAdvertismentLoading = createSelector(selectAdvertismentState, (state) => state.loading);
export const selectAdvertismentError = createSelector(selectAdvertismentState, (state) => state.error);
