import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  register(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      username,
      password,
    });
  }
}
