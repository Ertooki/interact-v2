import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {EventService} from '../services';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export class AttributesDatasource implements DataSource<Object> {
  private attrTypesSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public elemCount = 0;

  constructor(private eventService: EventService) {}

  connect(collectionViewer: CollectionViewer): Observable<Object[]> {
    return this.attrTypesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.attrTypesSubject.complete();
    this.loadingSubject.complete();
  }

  loadAttributes(id: number, type: number, limit = 10, offset = 0) {
    this.loadingSubject.next(true);
    this.eventService.getAttributes(id, type, limit, offset)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(attributes => {
        this.elemCount = attributes.length;
        console.log(attributes);
        this.attrTypesSubject.next(attributes);
      });
  }
}
