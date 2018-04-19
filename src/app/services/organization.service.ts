import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrganizationService {

  URL = 'http://10.10.11.24:8080/cyber_incidents/api/organization';

  constructor(private http: HttpClient) {
  }

  list(): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.URL}/all`);
  }
}
