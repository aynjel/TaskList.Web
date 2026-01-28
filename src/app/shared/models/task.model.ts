export interface TaskItem {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  category: number;
  status: number;
  userId: string;
  createdAt: string;
  lastModifiedAt: any;
}

export interface ByStatus {
  Todo: number;
  Completed: number;
  InProgress: number;
}

export interface ByPriority {
  Medium: number;
  High: number;
  Low: number;
}

export interface ByCategory {
  Work: number;
  Shopping: number;
}
