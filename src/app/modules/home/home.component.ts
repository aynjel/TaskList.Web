import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../auth/store/auth.store';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly authStore = inject(AuthStore);

  readonly isLoggedIn = this.authStore.isLoggedIn;
  readonly currentUser = this.authStore.currentUser;

  logout(): void {
    this.authStore.logout();
  }
}
