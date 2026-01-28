import { ByCategory, ByPriority, ByStatus, TaskItem } from '../../../shared/models/task.model';

export interface TaskSummary {
  summary: string;
  metrics: Metrics;
  tasksToday: TaskItem[];
  upcomingTasks: TaskItem[];
  generatedAt: string;
}

export interface Metrics {
  totalTasks: number;
  dueToday: number;
  dueThisWeek: number;
  overdue: number;
  byStatus: ByStatus;
  byPriority: ByPriority;
  byCategory: ByCategory;
}
