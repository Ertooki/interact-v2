import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TagService {

  URL = 'http://10.10.11.24:8080/cyber_incidents/api/tags';

  constructor(private http: HttpClient) {
  }

  search(val: string): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/findAll/${val}`);
  }

  findOne(val: string): Observable<Object> {
    return this.http.get<Object>(`${this.URL}/findOne/${val}`);
  }

  list(): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/all`);
  }

  add(val: String): Observable<Object> {
    return this.http.post<Object>(`${this.URL}/create/${val}`, {});
  }
}
