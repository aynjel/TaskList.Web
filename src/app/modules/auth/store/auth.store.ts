import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { clearCache } from '../../../shared/interceptors/cache.interceptor';
import { ApiResponse } from '../../../shared/models/api.model';
import { GlobalStore } from '../../../shared/store/global.store';
import { AuthUserResponse, LoginUserRequest, RegisterUserRequest } from '../models/common.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

type AuthStateType = {
  currentUser: User | undefined;
};

const TOKEN_KEY = 'auth_token';

const INITIAL_STATE: AuthStateType = {
  currentUser: undefined,
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
    token: computed(() => localStorage.getItem(TOKEN_KEY) || undefined),
  })),
  withMethods((store) => {
    const setCurrentUser = (user: User | undefined) => {
      patchState(store, { currentUser: user });
    };

    const setToken = (token: string | undefined) => {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    };

    const login = store.globalStore.withFormSubmission<LoginUserRequest, AuthUserResponse>(
      (payload) =>
        store.authService.login(payload).pipe(
          tapResponse({
            next: (response) => {
              setToken(response.token);
              fetchCurrentUser();
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
          tapResponse({
            next: (response) => {
              setToken(response.token);
              fetchCurrentUser();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Registration error:', error);
            },
          }),
        ),
    );

    const logout = store.globalStore.withApiState<void, ApiResponse>(() =>
      store.authService.logout().pipe(
        tapResponse({
          next: (_) => {
            patchState(store, { currentUser: undefined });
            localStorage.removeItem(TOKEN_KEY);
            clearCache(); // Clear all cached API responses
            store.router.navigateByUrl('/auth/login').then(() => {
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
        tapResponse({
          next: (response) => {
            setCurrentUser(response);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Fetch current user error:', error);
          },
        }),
      ),
    );

    const refreshToken = store.globalStore.withApiState<void, AuthUserResponse>(() =>
      store.authService.refreshToken().pipe(
        tapResponse({
          next: (response) => {
            setToken(response.token);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Refresh token error:', error);
          },
        }),
      ),
    );

    return {
      login,
      register,
      logout,
      fetchCurrentUser,
      refreshToken,
    };
  }),
);
