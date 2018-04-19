import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {AuthService, EventService} from '../services';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export class EventDataSource implements DataSource<Object> {
  private eventsSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public elemCount = 0;

  constructor(private eventService: EventService, private authService: AuthService) {}

  connect(collectionViewer: CollectionViewer): Observable<Object[]> {
    return this.eventsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.eventsSubject.complete();
    this.loadingSubject.complete();
  }

  loadEvents(limit = 10, offset = 0, scope = 2, organizationId = this.authService.getOrganizationID()) {
    this.loadingSubject.next(true);
    if (this.authService.getRole() === 'admin') {
      this.eventService.listAll(limit, offset, scope, organizationId).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
        .subscribe(events => {
          this.elemCount = events.length;
          for (let i = 0; i < events.length; i++) {
            events[i]['tags'] = events[i]['tags'].split(',');
          }
          this.eventsSubject.next(events);
        });
    } else {
      this.eventService.list(limit, offset, scope).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
        .subscribe(events => {
          this.elemCount = events.length;
          for (let i = 0; i < events.length; i++) {
            events[i]['tags'] = events[i]['tags'].split(',');
          }
          this.eventsSubject.next(events);
        });
    }

  }
}
