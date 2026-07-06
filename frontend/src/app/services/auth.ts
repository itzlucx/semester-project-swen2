import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { AuthStateService } from './auth-state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private state = inject(AuthStateService);

  private apiUrl = `${environment.apiUrl}/api/auth`;

  register(request: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap((response) => this.state.setAuth(response.token, response.username)));
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.state.setAuth(response.token, response.username)));
  }

  logout(): void {
    this.state.clearAuth();
  }
}
