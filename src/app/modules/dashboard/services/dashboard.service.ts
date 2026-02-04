import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../shared/const/endpoints.const';
import { TaskItem } from '../../../shared/models/task.model';
import { TaskFilterParams } from '../models/task-items.model';
import { TaskSummary } from '../models/task-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private httpClient = inject(HttpClient);
  private readonly apiAiUrl = environment.apiUrl + ENDPOINTS.AI;
  private readonly apiTaskUrl = environment.apiUrl + ENDPOINTS.TASKS;

  getDashboardStats(): Observable<TaskSummary> {
    return this.httpClient.get<TaskSummary>(`${this.apiAiUrl}/summary`);
  }

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
    return this.httpClient.get<TaskItem[]>(this.apiTaskUrl, { params });
  }
}
