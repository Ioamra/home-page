import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http: HttpClient = inject(HttpClient);

  login(dto: LoginRequest): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      {
        ...dto,
      },
      { observe: 'response', withCredentials: true },
    );
  }

  register(dto: RegisterRequest): Observable<HttpResponse<AuthResponse>> {
    const formData = new FormData();
    const entries = Object.entries(dto) as [
      keyof RegisterRequest,
      RegisterRequest[keyof RegisterRequest],
    ][];
    entries.forEach(([key, value]) => {
      if (key === 'photo') {
        formData.append(
          'photo',
          value instanceof Blob ? value : new Blob([], { type: 'application/octet-stream' }),
          '',
        );
      } else {
        formData.append(key as string, value as string);
      }
    });
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
