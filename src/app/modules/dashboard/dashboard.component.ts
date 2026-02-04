import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  PriorityColors,
  StatusColors,
  TaskPriorityList,
  TaskStatusList,
} from '../../shared/const/tasks.const';
import { GlobalStore } from '../../shared/store/global.store';
import { TaskFormComponent } from '../tasks/components/task-form/task-form.component';
import { DashboardSkeletonComponent } from './components/dashboard-skeleton/dashboard-skeleton.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { TaskBreakdownComponent } from './components/task-breakdown/task-breakdown.component';
import { TaskListSectionComponent } from './components/task-list-section/task-list-section.component';
import { DashboardStore } from './store/dashboard.store';

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    SidebarComponent,
    StatsCardsComponent,
    TaskBreakdownComponent,
    TaskListSectionComponent,
    TaskFormComponent,
    DashboardSkeletonComponent,
  ],
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
}
