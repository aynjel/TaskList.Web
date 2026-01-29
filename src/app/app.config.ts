import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  RendererFactory2,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { AuthStore } from './modules/auth/store/auth.store';
import { cacheInterceptor } from './shared/interceptors/cache.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';

const INITIALIZE_APP = async (): Promise<void> => {
  const authStore = inject(AuthStore);
  const document = inject(DOCUMENT);
  const renderer = inject(RendererFactory2).createRenderer(null, null);

  authStore.silentRefresh();

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      const splash = document.getElementById('initial-splash');

      if (splash) {
        const parent = renderer.parentNode(splash) ?? document.body;
        renderer.removeChild(parent, splash);
      }

      console.log('🚀 Initialization Complete');
      resolve();
    }, 800);
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, errorInterceptor, cacheInterceptor]),
    ),
    provideAppInitializer(async () => await INITIALIZE_APP()),
    provideToastr(),
  ],
};
