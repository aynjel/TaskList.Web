import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Metrics } from '../../models/task-summary.model';

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './stats-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardsComponent {
  readonly metrics = input.required<Metrics>();
}
