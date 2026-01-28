import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthStore } from '../../modules/auth/store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  if (!authStore.isLoggedIn()) {
    toastrService.error('You must be logged in to access this page.', 'Access Denied');
    router.navigate(['/home']);
    return false;
  }
  return true;
};
