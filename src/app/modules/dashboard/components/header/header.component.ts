import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authStore = inject(AuthStore);

  readonly isLoading = this.authStore.globalStore.isLoading;
  readonly currentUser = this.authStore.currentUser;
  readonly showUserMenu = signal(false);

  toggleUserMenu(): void {
    if (this.isLoading()) return;
    this.showUserMenu.update((value) => !value);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  logout(): void {
    this.authStore.logout();
    this.closeUserMenu();
  }
}
