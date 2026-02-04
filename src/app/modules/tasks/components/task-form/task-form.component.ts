import { Component, DOCUMENT, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CategoryTypeList,
  TaskPriorityList,
  TaskStatusList,
} from '../../../../shared/const/tasks.const';
import { TaskItem } from '../../../../shared/models/task.model';
import { CreateTaskRequests } from '../../models/common.model';
import { TasksStore } from '../../store/tasks.store';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  host: {
    '(document:keydown.escape)': 'onEscapeKey($event)',
  },
})
export class TaskFormComponent {
  readonly tasksStore = inject(TasksStore);
  readonly fb = inject(FormBuilder);
  readonly document = inject(DOCUMENT);

  readonly isOpen = input<boolean>(false);
  readonly taskId = input<number | null>(null);
  readonly isEditMode = input<boolean>(false);
  readonly formSubmitted = output<void>();
  readonly cancelled = output<void>();
  readonly closed = output<void>();

  readonly statusList = TaskStatusList;
  readonly priorityList = TaskPriorityList;
  readonly categoryList = CategoryTypeList;

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    priority: [2, [Validators.required]],
    category: [1, [Validators.required]],
    dueDate: [''],
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.document.body.style.overflow = 'hidden';
      } else {
        this.document.body.style.overflow = 'auto';
      }
    });

    // Populate form when modal opens
    effect(() => {
      if (this.isOpen()) {
        if (this.isEditMode() && this.taskId()) {
          const task = this.tasksStore.tasks().find((t) => t.id === this.taskId());
          if (task) {
            this.populateForm(task);
          }
        } else {
          this.resetForm();
        }
      }
    });
  }

  resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 2,
      category: 1,
      dueDate: '',
    });
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
  }

  populateForm(task: TaskItem): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: Number(task.priority),
      category: Number(task.category),
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
    });
  }

  formatDateForInput(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    console.log('Submitting form', this.taskForm.value);
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const payload: CreateTaskRequests = {
        title: formValue.title!,
        description: formValue.description || null,
        priority: Number(formValue.priority!),
        category: Number(formValue.category!),
        dueDate: formValue.dueDate || null,
      };

      if (this.isEditMode() && this.taskId()) {
        this.tasksStore.updateTask({
          data: { taskId: this.taskId()!, payload },
          onSuccess: () => {
            this.formSubmitted.emit();
          },
        });
      } else {
        this.tasksStore.createTask({
          data: payload,
          onSuccess: () => {
            this.formSubmitted.emit();
          },
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onEscapeKey(event: Event): void {
    if (this.isOpen() && event instanceof KeyboardEvent) {
      event.preventDefault();
      this.onClose();
    }
  }
}
