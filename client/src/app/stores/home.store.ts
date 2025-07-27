import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { UserInfo } from '../models/home.model';
import { HomeApiService } from '../services/home.api.service';
import { AuthStore } from './auth.store';

interface HomeState {
  userInfo: UserInfo;
  isLoading: boolean;
}

const initialState: HomeState = {
  userInfo: {
    user_account: null,
    homeSettings: {
      backgroundImageUrl:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fflurry-jagged-angular-shapes-digital-art-illustration_783299-1110.jpg&f=1&nofb=1&ipt=4886857085cca3a202adc41b81ea845782e97060f832e2f0c8f32b446682d62c',
    },
  },
  isLoading: false,
};

export const HomeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authStore = inject(AuthStore), homeApiService = inject(HomeApiService)) => ({
    getMyConfig: (): void => {
      patchState(store, { isLoading: true });
      homeApiService.getMyInfo().subscribe({
        next: response => {
          if (response.status === 200 && response.body) {
            patchState(store, { userInfo: response.body });
            authStore.setIsConnected(true);
          } else {
            throw new Error("L'utilisateur n'est pas connecté");
          }
        },
        error: () => {
          throw new Error("L'utilisateur n'est pas connecté");
        },
        complete: () => {
          patchState(store, { isLoading: false });
        },
      });
    },
  })),
);
