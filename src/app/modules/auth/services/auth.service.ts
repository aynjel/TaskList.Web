import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ENDPOINTS } from '../../../shared/const/endpoints.const';
import { ApiResponse } from '../../../shared/models/api.model';
import { AuthUserResponse, LoginUserRequest } from '../models/common.model';
import { User } from '../models/user.model';
import { RegisterUserRequest } from './../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + ENDPOINTS.AUTH;

  login(payload: LoginUserRequest): Observable<AuthUserResponse> {
    return this.httpClient.post<AuthUserResponse>(`${this.apiUrl}/login`, payload);
  }

  register(payload: RegisterUserRequest): Observable<AuthUserResponse> {
    return this.httpClient.post<AuthUserResponse>(`${this.apiUrl}/register`, payload);
  }

  logout(): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.apiUrl}/logout`, {});
  }

  refreshToken(): Observable<AuthUserResponse> {
    return this.httpClient.post<AuthUserResponse>(`${this.apiUrl}/refresh`, {});
  }

  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/me`);
  }
}
