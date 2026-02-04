import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { TaskSearchModalComponent } from '../task-search-modal/task-search-modal.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TaskSearchModalComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authStore = inject(AuthStore);

  readonly isLoading = this.authStore.globalStore.isLoading;
  readonly currentUser = this.authStore.currentUser;
  readonly showUserMenu = signal(false);
  readonly showSearchModal = signal(false);

  // @HostListener('document:keydown.control.k', ['$event'])
  // @HostListener('document:keydown.meta.k', ['$event'])
  // onKeyboardShortcut(event: KeyboardEvent): void {
  //   event.preventDefault();
  //   this.openSearchModal();
  // }

  openSearchModal(): void {
    this.showSearchModal.set(true);
  }

  closeSearchModal(): void {
    this.showSearchModal.set(false);
  }

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
