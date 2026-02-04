import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  PriorityColors,
  StatusColors,
  TaskPriorityList,
  TaskStatusList,
} from '../../../../shared/const/tasks.const';
import { ByPriority, ByStatus } from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-breakdown',
  imports: [],
  templateUrl: './task-breakdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBreakdownComponent {
  readonly byStatus = input.required<ByStatus>();
  readonly byPriority = input.required<ByPriority>();

  readonly TASK_STATUS_LIST = TaskStatusList;
  readonly TASK_PRIORITY_LIST = TaskPriorityList;
  readonly STATUS_COLORS = StatusColors;
  readonly PRIORITY_COLORS = PriorityColors;

  getStatusCount(statusLabel: string): number {
    return this.byStatus()[statusLabel as keyof ByStatus] || 0;
  }

  getPriorityCount(priorityLabel: string): number {
    return this.byPriority()[priorityLabel as keyof ByPriority] || 0;
  }
}
