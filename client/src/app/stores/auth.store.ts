import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthApiService } from '../services/auth.api.service';

interface AuthState {
  isConnected: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isConnected: false,
  isLoading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authApiService = inject(AuthApiService)) => ({
    login: (dto: LoginRequest): void => {
      patchState(store, { isLoading: true });
      authApiService.login(dto).subscribe({
        next: (response: HttpResponse<AuthResponse>) => {
          if (response.status === 200) {
            patchState(store, { isConnected: true, isLoading: false });
          } else {
            console.warn('Erreur lors de la connexion', response);
          }
        },
        error: (error: Error) => {
          console.error('Erreur lors de la récupération des clients', error);
        },
        complete: () => {
          patchState(store, { isLoading: false });
        },
      });
    },
    register: (dto: RegisterRequest): void => {
      patchState(store, { isLoading: true });
      authApiService.register(dto).subscribe({
        next: (response: HttpResponse<AuthResponse>) => {
          if (response.status === 200) {
            patchState(store, { isConnected: true, isLoading: false });
          } else {
            console.warn('Erreur lors de la connexion', response);
          }
        },
        error: (error: Error) => {
          console.error('Erreur lors de la récupération des clients', error);
        },
        complete: () => {
          patchState(store, { isLoading: false });
        },
      });
    },
  })),
);
