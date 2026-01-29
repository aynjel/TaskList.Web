import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from './store/auth.store';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AuthComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  private _ = effect(() => {
    if (this.authStore.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  });
}
