import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-skeleton',
  imports: [],
  templateUrl: './dashboard-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSkeletonComponent {}
