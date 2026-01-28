import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api.model';
import { GlobalStore } from '../../../shared/store/global.store';
import { AuthUserResponse, LoginUserRequest, RegisterUserRequest } from '../models/common.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

type AuthStateType = {
  currentUser: User | undefined;
  token: string | undefined;
};

const INITIAL_STATE: AuthStateType = {
  currentUser: undefined,
  token: undefined,
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
    isLoggedIn: computed(() => !!store.currentUser),
    hasAdminAccess: computed(() => false), // temporary placeholder
  })),
  withMethods((store) => ({
    setCurrentUser(user: User | undefined) {
      patchState(store, { currentUser: user });
    },

    login() {
      return store.globalStore.withFormSubmission<LoginUserRequest, AuthUserResponse>((payload) =>
        store.authService.login(payload).pipe(
          tap({
            next: (response) => {
              this.fetchCurrentUser();
              store.router.navigateByUrl('/dashboard').then(() => {
                store.toastrService.success('Login successful!', 'Success');
              });
            },
            error: (error: HttpErrorResponse) => {
              store.toastrService.error('Login failed. Please try again.', 'Error');
              console.error('Login error:', error);
            },
          }),
        ),
      );
    },

    register() {
      return store.globalStore.withFormSubmission<RegisterUserRequest, AuthUserResponse>(
        (payload) =>
          store.authService.register(payload).pipe(
            tap({
              next: (response) => {
                this.fetchCurrentUser();
                store.router.navigateByUrl('/dashboard').then(() => {
                  store.toastrService.success('Registration successful!', 'Success');
                });
              },
              error: (error: HttpErrorResponse) => {
                store.toastrService.error('Registration failed. Please try again.', 'Error');
                console.error('Registration error:', error);
              },
            }),
          ),
      );
    },

    logout() {
      return store.globalStore.withApiState<void, ApiResponse>(() =>
        store.authService.logout().pipe(
          tap({
            next: (_) => {
              patchState(store, { currentUser: undefined });
              store.router.navigateByUrl('/login').then(() => {
                store.toastrService.success('Logged out successfully.', 'Success');
              });
            },
            error: (error: HttpErrorResponse) => {
              store.toastrService.error('Logout failed. Please try again.', 'Error');
              console.error('Logout error:', error);
            },
          }),
        ),
      );
    },

    fetchCurrentUser() {
      return store.globalStore.withApiState<void, User>(() =>
        store.authService.getCurrentUser().pipe(
          tap({
            next: (response) => {
              patchState(store, {
                currentUser: {
                  id: response.id,
                  email: response.email,
                  name: response.name,
                },
              });
            },
            error: (error: HttpErrorResponse) => {
              console.error('Fetch current user error:', error);
            },
          }),
        ),
      );
    },

    refreshToken() {
      return store.globalStore.withApiState<void, User>(() =>
        store.authService.refreshToken().pipe(
          tap({
            next: (response) => {
              patchState(store, { currentUser: response });
            },
            error: (error: HttpErrorResponse) => {
              console.error('Refresh token error:', error);
            },
          }),
        ),
      );
    },
  })),
);
