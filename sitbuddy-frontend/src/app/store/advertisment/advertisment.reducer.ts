import { createReducer, on } from '@ngrx/store';
import * as AdvertismentActions from './advertisment.actions';
import { AdvertismentState } from './advertisment.state';

export const initialState: AdvertismentState = {
  advertisments: [],
  userAdvertisment: null,
  loading: false,
  error: null,
};

export const advertismentReducer = createReducer(
  initialState,
  
  on(AdvertismentActions.loadAdvertisments, (state) => ({ ...state, loading: true, error: null })),
  on(AdvertismentActions.loadAdvertismentsSuccess, (state, { advertisments }) => ({
    ...state,
    advertisments,
    loading: false,
  })),
  on(AdvertismentActions.loadAdvertismentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AdvertismentActions.loadUserAdvertisment, (state) => ({ ...state, loading: true, error: null })),
  on(AdvertismentActions.loadUserAdvertismentSuccess, (state, { advertisment }) => ({
    ...state,
    userAdvertisment: advertisment,
    loading: false,
  })),
  on(AdvertismentActions.loadUserAdvertismentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AdvertismentActions.createAdvertisment, (state) => ({ ...state, loading: true, error: null })),
  on(AdvertismentActions.createAdvertismentSuccess, (state, { advertisment }) => ({
    ...state,
    userAdvertisment: advertisment,
    loading: false,
  })),
  on(AdvertismentActions.createAdvertismentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AdvertismentActions.updateAdvertisment, (state) => ({ ...state, loading: true, error: null })),
  on(AdvertismentActions.updateAdvertismentSuccess, (state, { advertisment }) => ({
    ...state,
    userAdvertisment: advertisment,
    loading: false,
  })),
  on(AdvertismentActions.updateAdvertismentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(AdvertismentActions.deleteAdvertisment, (state) => ({ ...state, loading: true, error: null })),
  on(AdvertismentActions.deleteAdvertismentSuccess, (state) => ({
    ...state,
    userAdvertisment: null,
    loading: false,
  })),
  on(AdvertismentActions.deleteAdvertismentFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
