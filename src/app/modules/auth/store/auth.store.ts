import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { catchError, first, of, tap } from 'rxjs';
import { clearCache } from '../../../shared/interceptors/cache.interceptor';
import { ApiResponse } from '../../../shared/models/api.model';
import { GlobalStore } from '../../../shared/store/global.store';
import { AuthUserResponse, LoginUserRequest, RegisterUserRequest } from '../models/common.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

const SESSION_FLAG = 'has_session';

type AuthStateType = {
  currentUser: User | undefined;
  token: string | undefined; // Stored in-memory only (short-lived access token)
  refreshIntervalId: ReturnType<typeof setInterval> | undefined;
};

const INITIAL_STATE: AuthStateType = {
  currentUser: undefined,
  token: undefined,
  refreshIntervalId: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    authService: inject(AuthService),
    toastrService: inject(ToastrService),
    router: inject(Router),
  })),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.currentUser()),
  })),
  withMethods((store) => {
    const setCurrentUser = (user: User | undefined) => {
      patchState(store, { currentUser: user });
    };

    const setToken = (token: string | undefined) => {
      patchState(store, { token });
    };

    const setSessionFlag = (hasSession: boolean) => {
      if (hasSession) {
        localStorage.setItem(SESSION_FLAG, 'true');
      } else {
        localStorage.removeItem(SESSION_FLAG);
      }
    };

    const login = store.globalStore.withFormSubmission<LoginUserRequest, AuthUserResponse>(
      (payload) =>
        store.authService.login(payload).pipe(
          tap({
            next: (response) => {
              setToken(response.token);
              // Set session flag to indicate refresh token cookie exists
              setSessionFlag(true);
              // Fetch current user after successful login
              fetchCurrentUser();
              // Start background refresh after successful login
              startBackgroundRefresh();
              store.toastrService.success(`Welcome back, ${response.name}!`, 'Success');
            },
            error: (error: HttpErrorResponse) => {
              console.error('Login error:', error);
            },
          }),
        ),
    );

    const register = store.globalStore.withFormSubmission<RegisterUserRequest, AuthUserResponse>(
      (payload) =>
        store.authService.register(payload).pipe(
          tap({
            next: (response) => {
              setToken(response.token);
              setSessionFlag(true);
              fetchCurrentUser();
              // Start background refresh after successful registration
              startBackgroundRefresh();
              store.toastrService.success('Registered successfully.', 'Success');
            },
            error: (error: HttpErrorResponse) => {
              console.error('Registration error:', error);
            },
          }),
        ),
    );

    const logout = store.globalStore.withApiState<void, ApiResponse>(() =>
      store.authService.logout().pipe(
        tap({
          next: (_) => {
            setCurrentUser(undefined);
            setToken(undefined);
            stopBackgroundRefresh();
            setSessionFlag(false);
            clearCache(); // Clear all cached API responses
            store.router.navigate(['/auth/login']).then(() => {
              store.toastrService.success('Logged out successfully.', 'Success');
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Logout error:', error);
          },
        }),
      ),
    );

    const fetchCurrentUser = store.globalStore.withApiState<void, User>(() =>
      store.authService.getCurrentUser().pipe(
        tap({
          next: (response) => {
            setCurrentUser(response);
          },
          error: (_: HttpErrorResponse) => {
            // force logout on failure to get current user
            setCurrentUser(undefined);
            setToken(undefined);
            stopBackgroundRefresh();
            setSessionFlag(false);
          },
        }),
      ),
    );

    const refreshToken = store.globalStore.withApiState<void, AuthUserResponse>(() =>
      store.authService.refreshToken().pipe(
        tap({
          next: (response) => {
            setToken(response.token);
            // Fetch current user after successful token refresh
            fetchCurrentUser();
            // Start background refresh after successful token refresh
            startBackgroundRefresh();
          },
          error: (error: HttpErrorResponse) => {
            // Silent refresh failed - user needs to log in
            console.error('Refresh token error:', error);
            setCurrentUser(undefined);
            setToken(undefined);
            stopBackgroundRefresh();
            setSessionFlag(false);
          },
        }),
      ),
    );

    const silentRefresh = () => {
      const hasSession = localStorage.getItem(SESSION_FLAG);
      if (!hasSession) {
        return; // No session flag, skip refresh attempt
      }

      // Directly subscribe without using withApiState to avoid logging errors
      store.authService
        .refreshToken()
        .pipe(
          first(),
          tap({
            next: (response) => {
              setToken(response.token);
              // Ensure session flag is set
              setSessionFlag(true);
              // Fetch current user after successful token refresh
              fetchCurrentUser();
              // Start background refresh after successful token refresh
              startBackgroundRefresh();
            },
          }),
          catchError(() => {
            setSessionFlag(false);
            return of(null);
          }),
        )
        .subscribe();
    };

    const startBackgroundRefresh = () => {
      // Clear any existing interval
      stopBackgroundRefresh();

      const intervalId = setInterval(
        () => {
          console.log('🔄 Background token refresh');
          refreshToken();
        },
        14 * 60 * 1000,
      ); // 14 minutes in milliseconds

      patchState(store, { refreshIntervalId: intervalId });
    };

    const stopBackgroundRefresh = () => {
      const intervalId = store.refreshIntervalId();
      if (intervalId) {
        clearInterval(intervalId);
        patchState(store, { refreshIntervalId: undefined });
      }
    };

    return {
      login,
      register,
      logout,
      silentRefresh,
      stopBackgroundRefresh,
    };
  }),
  withHooks({
    onDestroy: (store) => {
      // Clean up background refresh interval on store destruction
      store.stopBackgroundRefresh();
    },
  }),
);
