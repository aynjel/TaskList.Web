import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryTypeList,
  PriorityColors,
  StatusColors,
  TaskPriorityList,
  TaskStatusList,
} from '../../../../shared/const/tasks.const';
import { TasksStore } from '../../store/tasks.store';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly tasksStore = inject(TasksStore);

  readonly statusList = TaskStatusList;
  readonly priorityList = TaskPriorityList;
  readonly categoryList = CategoryTypeList;
  readonly statusColors = StatusColors;
  readonly priorityColors = PriorityColors;

  readonly isEditing = signal(false);
  readonly taskId = signal<number | null>(null);
  readonly showDeleteConfirmation = signal(false);
  readonly isSubmitting = this.tasksStore.globalStore.isSubmitting;

  taskForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(200)]),
    description: new FormControl<string>(''),
    priority: new FormControl<number>(2, [Validators.required]),
    category: new FormControl<number>(1, [Validators.required]),
    status: new FormControl<number>(1, [Validators.required]),
    dueDate: new FormControl<string>(''),
  });

  constructor() {
    effect(() => {
      const task = this.tasksStore.selectedTask();
      if (task && !this.isEditing()) {
        this.populateForm(task);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId.set(Number(id));
      this.tasksStore.getTask(Number(id));
    }
  }

  populateForm(task: any): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      status: task.status,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
    });
  }

  formatDateForInput(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing() && this.tasksStore.selectedTask()) {
      this.populateForm(this.tasksStore.selectedTask());
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.taskId()) {
      const formValue = this.taskForm.value;
      const payload = {
        title: formValue.title!,
        description: formValue.description || null,
        priority: formValue.priority!,
        category: formValue.category!,
        dueDate: formValue.dueDate || null,
      };

      this.tasksStore.updateTask({ data: { taskId: this.taskId()!, payload } });
      this.isEditing.set(false);
    }
  }

  updateStatus(newStatus: number): void {
    if (this.taskId()) {
      this.tasksStore.updateTaskStatus({
        data: { taskId: this.taskId()!, taskStatus: newStatus as 1 | 2 | 3 | 4 },
      });
    }
  }

  deleteTask(): void {
    this.showDeleteConfirmation.set(true);
  }

  confirmDelete(): void {
    const task = this.tasksStore.selectedTask();
    if (task) {
      this.tasksStore.deleteTask({
        data: task.id,
        onSuccess: () => {
          this.closeDeleteConfirmation();
          this.goBack();
        },
      });
    }
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(false);
  }

  getDeleteMessage(): string {
    const task = this.tasksStore.selectedTask();
    return task
      ? `Are you sure you want to delete '${task.title}'? This action cannot be undone.`
      : 'Are you sure you want to delete this task? This action cannot be undone.';
  }

  goBack(): void {
    this.tasksStore.clearSelectedTask();
    this.router.navigate(['/tasks/list']);
  }
}
