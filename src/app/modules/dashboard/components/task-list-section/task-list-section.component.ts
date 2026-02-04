import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskItem } from '../../../../shared/models/task.model';

@Component({
  selector: 'app-task-list-section',
  imports: [DatePipe, RouterLink],
  templateUrl: './task-list-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListSectionComponent {
  readonly title = input.required<string>();
  readonly tasks = input.required<TaskItem[]>();
  readonly showViewAll = input<boolean>(true);

  getPriorityColor(priority: number): string {
    const colors: Record<number, string> = {
      1: 'bg-green-100 text-green-700',
      2: 'bg-yellow-100 text-yellow-700',
      3: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  }

  getPriorityLabel(priority: number): string {
    const labels: Record<number, string> = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
    };
    return labels[priority] || 'Unknown';
  }
}
