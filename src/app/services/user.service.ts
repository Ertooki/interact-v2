import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {

  URL = 'http://10.10.11.24:8080/cyber_incidents/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  list(limit = 10, offset = 0, organizationId = this.authService.getOrganizationID()): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/all?limit=${limit}&offset=${offset}&organizationId=${organizationId}`);
  }

  findByOrganizationId(limit = 10, offset = 0, organizationId = this.authService.getOrganizationID()): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/findByOrganizationId?id=${organizationId}&limit=${limit}&offset=${offset}`);
  }

  changeUserState(active: boolean, id: number) {
    if (active) {
      return this.http.put<Object>(`${this.URL}/activate?userId=${id}`, {});
    } else {
      return this.http.put<Object>(`${this.URL}/deactivate?userId=${id}`, {});
    }
  }

  changeUserRole(role: number, id: number) {
    return this.http.put<Object>(`${this.URL}/changeRole?userId=${id}&role=${role}`, {});
  }

  findByName(name: string): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/findByName?name=${name}`);
  }
}
