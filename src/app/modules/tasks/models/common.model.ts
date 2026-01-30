import { TaskItem } from '../../../shared/models/task.model';

export interface CreateTaskRequests {
  category: number;
  description?: string | null;
  dueDate?: string | null;
  priority: number;
  title: string;
}

export interface ExtractedTaskRequest {
  category: number;
  description: string;
  dueDate?: string | null;
  priority: number;
  title: string;
}

export interface ExtractedTaskResponse {
  createdTasks: TaskItem[];
  errors: ExtractedTaskError[];
  summary: ExtractedTaskSummary;
}

interface ExtractedTaskError {
  errorMessage: string;
  index: number;
  taskTitle: string;
}

interface ExtractedTaskSummary {
  completedAt: string;
  processingTimeMs: number;
  totalCreated: number;
  totalFailed: number;
  totalSubmitted: number;
}

export interface TaskFilterParams {
  status: number | null;
  priority: number | null;
  category: number | null;
  searchTerm: string | null;
  dueDateFrom: string | null;
  dueDateTo: string | null;
  sortBy: string | null;
  sortDescending: boolean;
  pageNumber: number;
  pageSize: number;
}

// export enum TaskStatus {
//   Pending = 1,
//   InProgress = 2,
//   Completed = 3,
//   Cancelled = 4,
// }

export type TaskStatusKey = 1 | 2 | 3 | 4;

// export interface TaskStatistics {
//   byStatus: Record<TaskStatusKey, number>;
//   byPriority: Record<string, number>;
//   byCategory: Record<string, number>;
// }
