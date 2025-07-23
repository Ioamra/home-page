import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

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
  withMethods(store => ({
    login: (username: string, password: string) => {
      patchState(store, { isLoading: true });
      console.log(username, password);
    },
  })),
);
