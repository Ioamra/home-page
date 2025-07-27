import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserInfo } from '../models/home.model';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  private readonly http: HttpClient = inject(HttpClient);

  getMyInfo(): Observable<HttpResponse<UserInfo>> {
    return this.http.get<UserInfo>(`${environment.apiUrl}/user-account/my-info`, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
