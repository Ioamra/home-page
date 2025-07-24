import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  login(username: string, password: string): Observable<HttpResponse<unknown>> {
    return this.http.post<unknown>(`${environment.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  register(username: string, password: string): Observable<HttpResponse<unknown>> {
    return this.http.post<unknown>(`${environment.apiUrl}/auth/register`, {
      username,
      password,
    });
  }
}
