import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CategoryTypeList,
  PriorityColors,
  TaskPriorityList,
} from '../../../../shared/const/tasks.const';
import { ExtractedTask, ExtractedTaskRequest } from '../../models/common.model';
import { TasksStore } from '../../store/tasks.store';

interface TaskFormValue {
  title: string;
  description: string;
  priority: number;
  category: number;
  dueDate: string;
  selected: boolean;
}

@Component({
  selector: 'app-review',
  imports: [ReactiveFormsModule],
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  private readonly router = inject(Router);
  readonly tasksStore = inject(TasksStore);

  readonly priorityList = TaskPriorityList;
  readonly categoryList = CategoryTypeList;
  readonly priorityColors = PriorityColors;

  readonly isSubmitting = this.tasksStore.globalStore.isSubmitting;

  readonly tasksForm = new FormGroup({
    tasks: new FormArray<
      FormGroup<{
        title: FormControl<string>;
        description: FormControl<string>;
        priority: FormControl<number>;
        category: FormControl<number>;
        dueDate: FormControl<string>;
        selected: FormControl<boolean>;
        confidence: FormControl<number>;
        sourceText: FormControl<string>;
      }>
    >([]),
  });

  readonly selectedCount = computed(() => {
    return this.tasksArray.controls.filter((control) => control.value.selected).length;
  });

  readonly allSelected = computed(() => {
    const controls = this.tasksArray.controls;
    return controls.length > 0 && controls.every((control) => control.value.selected);
  });

  get tasksArray(): FormArray {
    return this.tasksForm.get('tasks') as FormArray;
  }

  constructor() {
    effect(() => {
      console.log('Selected tasks count:', this.selectedCount());
    });
  }

  ngOnInit(): void {
    const extractedTasks = this.tasksStore.extractedTasks();

    if (!extractedTasks || extractedTasks.length === 0) {
      this.router.navigate(['/tasks/upload']);
      return;
    }

    this.initializeForm(extractedTasks);
  }

  initializeForm(tasks: ExtractedTask[]): void {
    tasks.forEach((task) => {
      const taskGroup = new FormGroup({
        title: new FormControl(task.title, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        description: new FormControl(task.description || '', { nonNullable: true }),
        priority: new FormControl(task.priority, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        category: new FormControl(task.suggestedCategory, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        dueDate: new FormControl(task.dueDate ? this.formatDateForInput(task.dueDate) : '', {
          nonNullable: true,
        }),
        selected: new FormControl(true, { nonNullable: true }),
        confidence: new FormControl(task.confidence, { nonNullable: true }),
        sourceText: new FormControl(task.sourceText || '', { nonNullable: true }),
      });
      this.tasksArray.push(taskGroup);
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  toggleSelectAll(): void {
    const newValue = !this.allSelected();
    this.tasksArray.controls.forEach((control) => {
      control.patchValue({ selected: newValue });
    });
  }

  removeTask(index: number): void {
    this.tasksArray.removeAt(index);
    if (this.tasksArray.length === 0) {
      this.router.navigate(['/tasks/upload']);
    }
  }

  getPriorityLabel(priority: number): string {
    return this.priorityList.find((p) => p.value === priority)?.label || 'Unknown';
  }

  getCategoryLabel(category: number): string {
    return this.categoryList.find((c) => c.value === category)?.label || 'Unknown';
  }

  getConfidenceLevel(confidence: number): string {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  submitTasks(): void {
    if (this.tasksForm.invalid) {
      this.tasksForm.markAllAsTouched();
      return;
    }

    const selectedTasks = this.tasksArray.controls
      .filter((control) => control.value.selected)
      .map((control) => {
        const value = control.value;
        return {
          title: value.title,
          description: value.description,
          priority: value.priority,
          category: value.category,
          dueDate: value.dueDate || null,
        } as ExtractedTaskRequest;
      });

    if (selectedTasks.length === 0) {
      return;
    }

    this.tasksStore.createTaskFromExtractions({
      data: selectedTasks,
      onSuccess: () => {
        this.router.navigate(['/tasks/list']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks/upload']);
  }

  cancel(): void {
    this.router.navigate(['/tasks/list']);
  }
}
