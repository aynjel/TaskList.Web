export const CategoryTypes = {
  WORK: 1,
  PERSONAL: 2,
  SHOPPING: 3,
} as const;

export const TaskStatuses = {
  TODO: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export const TaskPriorities = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export const CategoryTypeList = [
  { label: 'Work', value: CategoryTypes.WORK },
  { label: 'Personal', value: CategoryTypes.PERSONAL },
  { label: 'Shopping', value: CategoryTypes.SHOPPING },
];

export const TaskStatusList = [
  { label: 'To Do', value: TaskStatuses.TODO },
  { label: 'In Progress', value: TaskStatuses.IN_PROGRESS },
  { label: 'Completed', value: TaskStatuses.COMPLETED },
  { label: 'Cancelled', value: TaskStatuses.CANCELLED },
];

export const TaskPriorityList = [
  { label: 'Low', value: TaskPriorities.LOW },
  { label: 'Medium', value: TaskPriorities.MEDIUM },
  { label: 'High', value: TaskPriorities.HIGH },
];

export const StatusColors: Record<number, string> = {
  [TaskStatuses.TODO]: 'bg-gray-100 text-gray-700',
  [TaskStatuses.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [TaskStatuses.COMPLETED]: 'bg-green-100 text-green-700',
  [TaskStatuses.CANCELLED]: 'bg-red-100 text-red-700',
};

export const PriorityColors: Record<number, string> = {
  [TaskPriorities.LOW]: 'bg-green-100 text-green-700',
  [TaskPriorities.MEDIUM]: 'bg-yellow-100 text-yellow-700',
  [TaskPriorities.HIGH]: 'bg-red-100 text-red-700',
};
