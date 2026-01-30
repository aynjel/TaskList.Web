import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  CategoryTypeList,
  PriorityColors,
  StatusColors,
  TaskPriorityList,
  TaskStatusList,
} from '../../../../shared/const/tasks.const';
import { TaskItem } from '../../../../shared/models/task.model';
import { TasksStore } from '../../store/tasks.store';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-list',
  imports: [ReactiveFormsModule, TaskFormComponent, ConfirmationModalComponent],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  private readonly router = inject(Router);
  readonly tasksStore = inject(TasksStore);

  readonly statusList = TaskStatusList;
  readonly priorityList = TaskPriorityList;
  readonly categoryList = CategoryTypeList;
  readonly statusColors = StatusColors;
  readonly priorityColors = PriorityColors;

  readonly isSubmitting = this.tasksStore.globalStore.isSubmitting;

  readonly showCreateModal = signal(false);
  readonly isEditMode = signal(false);
  readonly selectedTaskId = signal<number | null>(null);

  readonly showDeleteConfirmation = signal(false);
  readonly taskToDelete = signal<{ id: number; title: string } | null>(null);

  filterForm = new FormGroup({
    searchTerm: new FormControl<string>(''),
    status: new FormControl<number | null>(null),
    priority: new FormControl<number | null>(null),
    category: new FormControl<number | null>(null),
    sortBy: new FormControl<string>('createdAt'),
  });

  constructor() {
    effect(() => {
      console.log('Filtered Tasks:', this.tasksStore.filteredTasks());
    });
  }

  ngOnInit(): void {
    this.tasksStore.getTasks(undefined);

    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
      this.tasksStore.setFilterParams({
        searchTerm: values.searchTerm || null,
        status: values.status,
        priority: values.priority,
        category: values.category,
        sortBy: values.sortBy || null,
      });
    });
  }

  getStatusLabel(status: number): string {
    return this.statusList.find((s) => s.value === status)?.label || 'Unknown';
  }

  getPriorityLabel(priority: number): string {
    return this.priorityList.find((p) => p.value === priority)?.label || 'Unknown';
  }

  getCategoryLabel(category: number): string {
    return this.categoryList.find((c) => c.value === category)?.label || 'Unknown';
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedTaskId.set(null);
    this.showCreateModal.set(true);
  }

  openEditModal(task: TaskItem): void {
    this.isEditMode.set(true);
    this.selectedTaskId.set(task.id);
    this.showCreateModal.set(true);
  }

  closeModal(): void {
    this.showCreateModal.set(false);
    this.isEditMode.set(false);
    this.selectedTaskId.set(null);
  }

  viewTaskDetails(taskId: number): void {
    this.router.navigate(['/tasks/details', taskId]);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  updateTaskStatus(taskId: number, newStatus: number): void {
    this.tasksStore.updateTaskStatus({ data: { taskId, taskStatus: newStatus as 1 | 2 | 3 | 4 } });
  }

  deleteTask(taskId: number, taskTitle: string): void {
    this.taskToDelete.set({ id: taskId, title: taskTitle });
    this.showDeleteConfirmation.set(true);
  }

  confirmDelete(): void {
    const task = this.taskToDelete();
    if (task) {
      this.tasksStore.deleteTask({
        data: task.id,
        onSuccess: () => {
          this.closeDeleteConfirmation();
        },
      });
    }
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(false);
    this.taskToDelete.set(null);
  }

  getDeleteMessage(): string {
    const task = this.taskToDelete();
    return task
      ? `Are you sure you want to delete '${task.title}'? This action cannot be undone.`
      : 'Are you sure you want to delete this task? This action cannot be undone.';
  }

  clearFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      status: null,
      priority: null,
      category: null,
      sortBy: 'createdAt',
    });
    this.tasksStore.resetFilterParams();
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
