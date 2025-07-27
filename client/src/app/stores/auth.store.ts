import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthApiService } from '../services/auth.api.service';

interface AuthState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isConnected: false,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authApiService = inject(AuthApiService)) => ({
    login: (dto: LoginRequest): Observable<HttpResponse<AuthResponse>> => {
      patchState(store, { isLoading: true, error: null });
      return authApiService.login(dto).pipe(
        tap(response => {
          if (response.status === 200) {
            patchState(store, {
              isConnected: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Erreur lors de la connexion');
          }
        }),
        catchError(() => {
          throw new Error('Erreur lors de la connexion');
        }),
        finalize(() => {
          patchState(store, { isLoading: false });
        }),
      );
    },

    register: (dto: RegisterRequest): void => {
      patchState(store, { isLoading: true, error: null });
      authApiService.register(dto).subscribe({
        next: response => {
          if (response.status === 201) {
            patchState(store, {
              isLoading: false,
              error: null,
              isConnected: true,
            });
          } else {
            throw new Error("Erreur lors de l'inscription");
          }
        },
        error: () => {
          throw new Error("Erreur lors de l'inscription");
        },
        complete: () => {
          patchState(store, { isLoading: false });
        },
      });
    },

    setIsConnected: (isConnected: boolean): void => {
      patchState(store, { isConnected });
    },

    logout: (): void => {
      patchState(store, {
        isConnected: false,
        isLoading: false,
        error: null,
      });
    },

    clearError: (): void => {
      patchState(store, { error: null });
    },
  })),
);
