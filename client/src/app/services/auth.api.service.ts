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
      { observe: 'response' },
    );
  }

  register(dto: RegisterRequest): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/register`,
      {
        ...dto,
      },
      { observe: 'response' },
    );
  }
}
