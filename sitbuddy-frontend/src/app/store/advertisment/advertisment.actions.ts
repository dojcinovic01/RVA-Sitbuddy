import { createAction, props } from '@ngrx/store';
import { Advertisment } from './advertisment.state';

export const loadAdvertisments = createAction('[Advertisment] Load Advertisments');
export const loadAdvertismentsSuccess = createAction('[Advertisment] Load Advertisments Success', props<{ advertisments: Advertisment[] }>());
export const loadAdvertismentsFailure = createAction('[Advertisment] Load Advertisments Failure', props<{ error: string }>());

export const loadUserAdvertisment = createAction('[Advertisment] Load User Advertisment', props<{ userId: number }>());
export const loadUserAdvertismentSuccess = createAction('[Advertisment] Load User Advertisment Success', props<{ advertisment: Advertisment | null }>());
export const loadUserAdvertismentFailure = createAction('[Advertisment] Load User Advertisment Failure', props<{ error: string }>());

export const createAdvertisment = createAction('[Advertisment] Create Advertisment', props<{ advertisment: Omit<Advertisment, 'id'> }>());
export const createAdvertismentSuccess = createAction('[Advertisment] Create Advertisment Success', props<{ advertisment: Advertisment }>());
export const createAdvertismentFailure = createAction('[Advertisment] Create Advertisment Failure', props<{ error: string }>());

export const updateAdvertisment = createAction('[Advertisment] Update Advertisment', props<{ id: number; advertisment: Partial<Advertisment> }>());
export const updateAdvertismentSuccess = createAction('[Advertisment] Update Advertisment Success', props<{ advertisment: Advertisment }>());
export const updateAdvertismentFailure = createAction('[Advertisment] Update Advertisment Failure', props<{ error: string }>());

export const deleteAdvertisment = createAction('[Advertisment] Delete Advertisment', props<{ id: number }>());
export const deleteAdvertismentSuccess = createAction('[Advertisment] Delete Advertisment Success', props<{ id: number }>());
export const deleteAdvertismentFailure = createAction('[Advertisment] Delete Advertisment Failure', props<{ error: string }>());

export const loadFollowedAdvertisments = createAction('[Advertisment] Load Followed Advertisments', props<{ userId: number }>());
export const loadFollowedAdvertismentsSuccess = createAction('[Advertisment] Load Followed Advertisments Success', props<{ advertisments: Advertisment[] }>());
export const loadFollowedAdvertismentsFailure = createAction('[Advertisment] Load Followed Advertisments Failure', props<{ error: string }>());

export const loadTopRatedAdvertisments = createAction('[Advertisment] Load Top Rated Advertisments');
export const loadTopRatedAdvertismentsSuccess = createAction('[Advertisment] Load Top Rated Advertisments Success', props<{ advertisments: Advertisment[] }>());
export const loadTopRatedAdvertismentsFailure = createAction('[Advertisment] Load Top Rated Advertisments Failure', props<{ error: string }>());

export const loadCriminalProofAdvertisments = createAction('[Advertisment] Load Criminal Proof Advertisments');
export const loadCriminalProofAdvertismentsSuccess = createAction('[Advertisment] Load Criminal Proof Advertisments Success', props<{ advertisments: Advertisment[] }>());
export const loadCriminalProofAdvertismentsFailure = createAction('[Advertisment] Load Criminal Proof Advertisments Failure', props<{ error: string }>());
