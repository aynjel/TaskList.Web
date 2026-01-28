import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../shared/const/endpoints.const';
import { TaskSummary } from '../models/task-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + ENDPOINTS.AI;

  getDashboardStats(): Observable<TaskSummary> {
    return this.httpClient.get<TaskSummary>(`${this.apiUrl}/summary`);
  }
}
