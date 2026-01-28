import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelErrors: string[] = [];
              const errorObj = error.error.errors;

              for (const key in errorObj) {
                if (errorObj[key]) {
                  modelErrors.push(errorObj[key]);
                }
              }
              throw modelErrors.flat();
            } else {
              toastrService.error(error.error.message || 'Bad Request', 'Error');
              console.error('Bad Request:', error);
            }
            break;

          case 401:
            toastrService.error('Unauthorized access. Please log in.', 'Error');
            console.error('Unauthorized:', error);
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            toastrService.error(error.error.message || 'An unexpected error occurred.', 'Error');
            console.error(error);
            break;
        }
      }

      throw error;
    }),
  );
};
