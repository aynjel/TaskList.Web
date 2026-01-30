import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { TaskItem } from '../../../shared/models/task.model';
import { GlobalStore } from '../../../shared/store/global.store';
import {
  ExtractedTask,
  TaskFilterParams,
  UploadedDocumentTaskResponse,
} from '../models/common.model';
import { TasksService } from '../services/tasks.service';
import {
  CreateTaskRequests,
  ExtractedTaskRequest,
  ExtractedTaskResponse,
  TaskStatusKey,
} from './../models/common.model';

type TaskStateType = {
  tasks: TaskItem[];
  selectedTask: TaskItem | undefined;
  filterParams: TaskFilterParams;
  extractedTasks: ExtractedTask[];
};

const DEFAULT_FILTER_PARAMS: TaskFilterParams = {
  status: null,
  priority: null,
  category: null,
  searchTerm: null,
  dueDateFrom: null,
  dueDateTo: null,
  sortBy: null,
  sortDescending: false,
  pageNumber: 1,
  pageSize: 100,
};

const INITIAL_STATE: TaskStateType = {
  tasks: [],
  selectedTask: undefined,
  filterParams: DEFAULT_FILTER_PARAMS,
  extractedTasks: [],
};

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    taskService: inject(TasksService),
    toastService: inject(ToastrService),
  })),
  withComputed((store) => ({
    filteredTasks: computed(() => {
      let filtered = [...store.tasks()];
      const filter = store.filterParams();

      // Apply filters
      if (filter.status !== null) {
        filtered = filtered.filter((task) => task.status === filter.status);
      }
      if (filter.priority !== null) {
        filtered = filtered.filter((task) => task.priority === filter.priority);
      }
      if (filter.category !== null) {
        filtered = filtered.filter((task) => task.category === filter.category);
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower),
        );
      }
      if (filter.dueDateFrom) {
        filtered = filtered.filter(
          (task) => task.dueDate && new Date(task.dueDate) >= new Date(filter.dueDateFrom!),
        );
      }
      if (filter.dueDateTo) {
        filtered = filtered.filter(
          (task) => task.dueDate && new Date(task.dueDate) <= new Date(filter.dueDateTo!),
        );
      }

      // Apply sorting
      if (filter.sortBy) {
        filtered.sort((a, b) => {
          let comparison = 0;
          switch (filter.sortBy) {
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'dueDate':
              comparison = (a.dueDate || '').localeCompare(b.dueDate || '');
              break;
            case 'priority':
              comparison = a.priority - b.priority;
              break;
            case 'status':
              comparison = a.status - b.status;
              break;
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
          }
          return filter.sortDescending ? -comparison : comparison;
        });
      }

      return filtered;
    }),
  })),
  withMethods((store) => {
    const getTasks = store.globalStore.withApiState<TaskFilterParams | undefined, TaskItem[]>(
      (filterParams?: TaskFilterParams) =>
        store.taskService.getTasks(filterParams || store.filterParams()).pipe(
          tap({
            next: (tasks) => {
              patchState(store, { tasks });
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error fetching tasks:', error);
            },
          }),
        ),
    );

    const getTask = store.globalStore.withApiState<number, TaskItem>((taskId: number) =>
      store.taskService.getTask(taskId).pipe(
        tap({
          next: (task) => {
            patchState(store, { selectedTask: task });
          },
          error: (error: HttpErrorResponse) => {
            console.error(`Error fetching task with ID ${taskId}:`, error);
          },
        }),
      ),
    );

    const createTask = store.globalStore.withFormSubmission<CreateTaskRequests, TaskItem>(
      (payload: CreateTaskRequests) =>
        store.taskService.createTask(payload).pipe(
          tap({
            next: (newTask) => {
              const currentTasks = store.tasks();
              patchState(store, { tasks: [...currentTasks, newTask] });
              store.toastService.success('Task created successfully', 'Success');
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error creating task:', error);
            },
          }),
        ),
    );

    const deleteTask = store.globalStore.withFormSubmission<number, void>((taskId: number) =>
      store.taskService.deleteTask(taskId).pipe(
        tap({
          next: () => {
            const updatedTasks = store.tasks().filter((task) => task.id !== taskId);
            patchState(store, { tasks: updatedTasks });
            store.toastService.success('Task deleted successfully', 'Success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting task:', error);
          },
        }),
      ),
    );

    const updateTask = store.globalStore.withFormSubmission<
      { taskId: number; payload: Partial<CreateTaskRequests> },
      TaskItem
    >(({ taskId, payload }) =>
      store.taskService.updateTask(taskId, payload).pipe(
        tap({
          next: (updatedTask) => {
            const updatedTasks = store
              .tasks()
              .map((task) => (task.id === taskId ? updatedTask : task));
            // Also update selectedTask if it's the same task being updated
            const currentSelectedTask = store.selectedTask();
            const newSelectedTask =
              currentSelectedTask?.id === taskId ? updatedTask : currentSelectedTask;
            patchState(store, { tasks: updatedTasks, selectedTask: newSelectedTask });
            store.toastService.success('Task updated successfully', 'Success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating task:', error);
          },
        }),
      ),
    );

    const updateTaskStatus = store.globalStore.withFormSubmission<
      { taskId: number; taskStatus: TaskStatusKey },
      TaskItem
    >(({ taskId, taskStatus }) =>
      store.taskService.updateTaskStatus(taskId, taskStatus).pipe(
        tap({
          next: (updatedTask) => {
            const updatedTasks = store
              .tasks()
              .map((task) => (task.id === taskId ? updatedTask : task));
            patchState(store, { tasks: updatedTasks, selectedTask: updatedTask });
            store.toastService.success('Task status updated successfully', 'Success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating task status:', error);
          },
        }),
      ),
    );

    const uploadDocumentForExtraction = store.globalStore.withFormSubmission<
      File,
      UploadedDocumentTaskResponse
    >((file: File) =>
      store.taskService.uploadDocumentForExtraction(file).pipe(
        tap({
          next: (response: UploadedDocumentTaskResponse) => {
            patchState(store, { extractedTasks: response.extractedTasks });
            store.toastService.success(
              `Document processed successfully. ${response.extractedTasks.length} tasks extracted.`,
              'Success',
            );
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error uploading document for extraction:', error);
          },
        }),
      ),
    );

    const createTaskFromExtractions = store.globalStore.withFormSubmission<
      ExtractedTaskRequest[],
      ExtractedTaskResponse
    >((extractions: ExtractedTaskRequest[]) =>
      store.taskService.createTaskFromExtractions(extractions).pipe(
        tap({
          next: (response: ExtractedTaskResponse) => {
            const currentTasks = store.tasks();
            patchState(store, { tasks: [...currentTasks, ...response.createdTasks] });
            store.toastService.success(
              `${response.summary.totalCreated} tasks created successfully`,
              'Success',
            );
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error creating tasks from extractions:', error);
          },
        }),
      ),
    );

    const setFilterParams = (params: Partial<TaskFilterParams>) => {
      patchState(store, { filterParams: { ...store.filterParams(), ...params } });
    };

    const resetFilterParams = () => {
      patchState(store, { filterParams: DEFAULT_FILTER_PARAMS });
    };

    const clearSelectedTask = () => {
      patchState(store, { selectedTask: undefined });
    };

    return {
      getTasks,
      getTask,
      createTask,
      deleteTask,
      updateTask,
      updateTaskStatus,
      uploadDocumentForExtraction,
      createTaskFromExtractions,
      resetFilterParams,
      setFilterParams,
      clearSelectedTask,
    };
  }),
);
