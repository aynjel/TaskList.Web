import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [RouterLink],
  templateUrl: './server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorComponent {
  onRetry(): void {
    window.location.reload();
  }
}
