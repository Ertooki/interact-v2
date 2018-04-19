import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class EventService {

  URL = 'http://10.10.11.24:8080/cyber_incidents/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  list(limit = 10, offset = 0, scope = 2): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}?scope=${scope}&limit=${limit}&offset=${offset}`);
  }

  listAll(limit = 10, offset = 0, scope = 2, organizationId): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/all?scope=${scope}&limit=${limit}&offset=${offset}&organizationId=${organizationId}`);
  }

  findOne(id: number): Observable<Object> {
    return this.http.get<Object>(`${this.URL}/findOne?id=${id}`);
  }

  create(tags: string, info: string, type: string, threatLevel: number, scopeView: number, scopeUpdate: number): Observable<Object> {
    const createParams = {
      authorId: this.authService.getUserID(),
      tags: tags,
      info: info,
      type: type,
      threatLevel: threatLevel,
      scopeView: scopeView,
      scopeUpdate: scopeUpdate,
    };
    return this.http.post<Object>(`${this.URL}`, createParams);
  }

  getAttributes(id: number, type: number, limit = 10, offset = 0): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/${id}/attribute/?group=${type}&limit=${limit}&offset=${offset}`);
  }

  addAttribute(id: number, attribute): Observable<Object> {
    return this.http.post<Object>(`${this.URL}/${id}/attribute`, attribute);
  }

  getResponsibles(id: number): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/${id}/responsible`);
  }

  addResponsible(id: number, user_id: number): Observable<Object> {
    return this.http.post<Object>(`${this.URL}/${id}/responsible?userId=${user_id}`, {});
  }
}
