import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PriorityColors,
  StatusColors,
  TaskPriorityList,
  TaskStatusList,
} from '../../shared/const/tasks.const';
import { ByPriority, ByStatus } from '../../shared/models/task.model';
import { GlobalStore } from '../../shared/store/global.store';
import { TaskFormComponent } from '../tasks/components/task-form/task-form.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardStore } from './store/dashboard.store';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, DatePipe, RouterLink, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardStore = inject(DashboardStore);
  private readonly globalStore = inject(GlobalStore);

  readonly taskSummary = this.dashboardStore.taskSummary;
  readonly isLoading = this.globalStore.isLoading;

  readonly TASK_STATUS_LIST = TaskStatusList;
  readonly TASK_PRIORITY_LIST = TaskPriorityList;

  readonly STATUS_COLORS = StatusColors;
  readonly PRIORITY_COLORS = PriorityColors;

  // Export types for template
  readonly ByStatus = {} as ByStatus;
  readonly ByPriority = {} as ByPriority;

  readonly showCreateTaskModal = signal(false);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.dashboardStore.loadDashboardStats();
  }

  openCreateTaskModal(): void {
    this.showCreateTaskModal.set(true);
  }

  closeCreateTaskModal(): void {
    this.showCreateTaskModal.set(false);
  }

  onTaskCreated(): void {
    this.closeCreateTaskModal();
    this.dashboardStore.loadDashboardStats();
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Todo: 'bg-gray-100 text-gray-700',
      InProgress: 'bg-blue-100 text-blue-700',
      Completed: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }
}
