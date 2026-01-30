import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isCollapsed = signal(false);
  readonly createTaskClick = output<void>();

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }

  onCreateTaskClick(): void {
    this.createTaskClick.emit();
  }
}
