import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../shared/const/endpoints.const';
import {
  CreateTaskRequests,
  ExtractedTaskRequest,
  ExtractedTaskResponse,
  TaskFilterParams,
  TaskStatusKey,
} from '../models/common.model';
import { TaskItem } from './../../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + ENDPOINTS.TASKS;

  getTasks(filterParams?: TaskFilterParams): Observable<TaskItem[]> {
    let params = new HttpParams();
    if (filterParams) {
      if (filterParams.status !== null) {
        params = params.set('status', filterParams.status.toString());
      }
      if (filterParams.priority !== null) {
        params = params.set('priority', filterParams.priority.toString());
      }
      if (filterParams.category !== null) {
        params = params.set('category', filterParams.category.toString());
      }
      if (filterParams.searchTerm) {
        params = params.set('searchTerm', filterParams.searchTerm);
      }
      if (filterParams.dueDateFrom) {
        params = params.set('dueDateFrom', filterParams.dueDateFrom);
      }
      if (filterParams.dueDateTo) {
        params = params.set('dueDateTo', filterParams.dueDateTo);
      }
      if (filterParams.sortBy) {
        params = params.set('sortBy', filterParams.sortBy);
      }
      params = params.set('sortDescending', filterParams.sortDescending.toString());
      params = params.set('pageNumber', filterParams.pageNumber.toString());
      params = params.set('pageSize', filterParams.pageSize.toString());
    }
    return this.httpClient.get<TaskItem[]>(this.apiUrl, { params });
  }

  getTask(taskId: number): Observable<TaskItem> {
    return this.httpClient.get<TaskItem>(`${this.apiUrl}/${taskId}`);
  }

  createTask(payload: CreateTaskRequests): Observable<TaskItem> {
    return this.httpClient.post<TaskItem>(this.apiUrl, payload);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  updateTask(taskId: number, payload: Partial<CreateTaskRequests>): Observable<TaskItem> {
    return this.httpClient.put<TaskItem>(`${this.apiUrl}/${taskId}`, payload);
  }

  updateTaskStatus(taskId: number, taskStatus: TaskStatusKey): Observable<TaskItem> {
    return this.httpClient.patch<TaskItem>(`${this.apiUrl}/${taskId}/status`, taskStatus);
  }

  createTaskFromExtractions(
    extractions: ExtractedTaskRequest[],
  ): Observable<ExtractedTaskResponse> {
    return this.httpClient.post<ExtractedTaskResponse>(`${this.apiUrl}/create-from-extraction`, {
      extractions,
    });
  }
}
