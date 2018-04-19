import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AttrTypeService {
  URL = 'http://10.10.11.24:8080/cyber_incidents/api/attributeType';

  constructor(private http: HttpClient) {
  }

  list(limit = 10, offset = 0, group = 0): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/findAll?limit=${limit}&offset=${offset}&group=${group}`);
  }

  create(attrType): Observable<Object> {
    return this.http.post<Object>(`${this.URL}/`, attrType);
  }

  find(name: string, group): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/findLike?name=${name}&group=${group}`);
  }

}
