import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface HomeState {
  backgroundImageUrl: string;
  isLoading: boolean;
}

const initialState: HomeState = {
  backgroundImageUrl:
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fflurry-jagged-angular-shapes-digital-art-illustration_783299-1110.jpg&f=1&nofb=1&ipt=4886857085cca3a202adc41b81ea845782e97060f832e2f0c8f32b446682d62c',
  isLoading: false,
};

export const HomeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    getMyConfig: (): void => {
      patchState(store, { isLoading: true });
    },
  })),
);
