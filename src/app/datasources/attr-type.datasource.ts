import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {AttrTypeService} from '../services';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export class AttrTypeDatasource implements DataSource<Object> {
  private attrTypesSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public elemCount = 0;

  constructor(private attrTypeService: AttrTypeService) {}

  connect(collectionViewer: CollectionViewer): Observable<Object[]> {
    return this.attrTypesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.attrTypesSubject.complete();
    this.loadingSubject.complete();
  }

  loadAttributeTypes(limit = 10, offset = 0) {
    this.loadingSubject.next(true);
    this.attrTypeService.list(limit, offset)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(attrTypes => {
        this.elemCount = attrTypes.length;
        this.attrTypesSubject.next(attrTypes);
      });
  }
}
