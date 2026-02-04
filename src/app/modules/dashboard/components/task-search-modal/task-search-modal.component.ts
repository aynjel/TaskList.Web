import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CategoryTypeList,
  TaskPriorityList,
  TaskStatusList,
} from '../../../../shared/const/tasks.const';
import { TaskItem } from '../../../../shared/models/task.model';
import { DashboardStore } from '../../store/dashboard.store';

@Component({
  selector: 'app-task-search-modal',
  imports: [FormsModule, DatePipe],
  templateUrl: './task-search-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSearchModalComponent implements OnInit {
  private readonly dashboardStore = inject(DashboardStore);
  private readonly router = inject(Router);

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  readonly searchTerm = signal('');
  readonly selectedStatus = signal<number | null>(null);
  readonly selectedPriority = signal<number | null>(null);
  readonly selectedCategory = signal<number | null>(null);
  readonly isSearching = signal(false);
  readonly showFilters = signal(false);

  readonly tasks = this.dashboardStore.tasks;
  readonly filteredTasks = signal<TaskItem[]>([]);
  readonly selectedIndex = signal(0);

  readonly TASK_STATUS_LIST = TaskStatusList;
  readonly TASK_PRIORITY_LIST = TaskPriorityList;
  readonly TASK_CATEGORY_LIST = CategoryTypeList;

  constructor() {
    // Watch for modal open/close to perform search
    effect(() => {
      if (this.isOpen()) {
        this.performSearch();
      } else {
        this.resetSearch();
      }
    });
  }

  ngOnInit(): void {
    this.performSearch();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen() || this.filteredTasks().length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const currentIndex = this.selectedIndex();
        const maxIndex = this.filteredTasks().length - 1;
        this.selectedIndex.set(currentIndex < maxIndex ? currentIndex + 1 : currentIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const index = this.selectedIndex();
        this.selectedIndex.set(index > 0 ? index - 1 : 0);
        break;

      case 'Enter':
        event.preventDefault();
        const selectedTask = this.filteredTasks()[this.selectedIndex()];
        if (selectedTask) {
          this.navigateToTask(selectedTask.id);
        }
        break;
    }
  }

  performSearch(): void {
    this.isSearching.set(true);
    this.dashboardStore.getTasks();

    // Filter tasks based on search criteria
    setTimeout(() => {
      const allTasks = this.tasks();
      let filtered = [...allTasks];

      // Apply search term filter
      const term = this.searchTerm().toLowerCase().trim();
      if (term) {
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term),
        );
      }

      // Apply status filter
      const status = this.selectedStatus();
      if (status !== null) {
        filtered = filtered.filter((task) => task.status === status);
      }

      // Apply priority filter
      const priority = this.selectedPriority();
      if (priority !== null) {
        filtered = filtered.filter((task) => task.priority === priority);
      }

      // Apply category filter
      const category = this.selectedCategory();
      if (category !== null) {
        filtered = filtered.filter((task) => task.category === category);
      }

      this.filteredTasks.set(filtered);
      this.selectedIndex.set(0);
      this.isSearching.set(false);
    }, 100);
  }

  onSearchChange(): void {
    this.performSearch();
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  clearFilters(): void {
    this.selectedStatus.set(null);
    this.selectedPriority.set(null);
    this.selectedCategory.set(null);
    this.performSearch();
  }

  navigateToTask(taskId: number): void {
    this.close();
    this.router.navigate(['/tasks/details', taskId]);
  }

  resetSearch(): void {
    this.searchTerm.set('');
    this.selectedStatus.set(null);
    this.selectedPriority.set(null);
    this.selectedCategory.set(null);
    this.showFilters.set(false);
    this.filteredTasks.set([]);
    this.selectedIndex.set(0);
  }

  close(): void {
    this.closed.emit();
  }

  getPriorityLabel(priority: number): string {
    const labels: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High' };
    return labels[priority] || 'Unknown';
  }

  getStatusLabel(status: number): string {
    const labels: Record<number, string> = { 0: 'Todo', 1: 'InProgress', 2: 'Completed' };
    return labels[status] || 'Unknown';
  }

  getCategoryLabel(category: number): string {
    const labels: Record<number, string> = { 0: 'Work', 1: 'Shopping' };
    return labels[category] || 'Unknown';
  }

  getPriorityColor(priority: number): string {
    const colors: Record<number, string> = {
      1: 'bg-green-100 text-green-700',
      2: 'bg-yellow-100 text-yellow-700',
      3: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  }

  getStatusColor(status: number): string {
    const colors: Record<number, string> = {
      0: 'bg-gray-100 text-gray-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }
}
