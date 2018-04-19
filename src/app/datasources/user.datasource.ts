import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {AuthService, UserService} from '../services';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export class UserDataSource implements DataSource<Object> {
  private usersSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public elemCount = 0;

  constructor(private userService: UserService, private authService: AuthService) {}

  connect(collectionViewer: CollectionViewer): Observable<Object[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers(limit = 10, offset = 0) {
    this.loadingSubject.next(true);

    this.userService.list(limit, offset).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(users => {
        console.log(users);
        this.elemCount = users.length;
        this.usersSubject.next(users);
      });
  }

  filterUsersByOrganizationId(limit = 10, offset = 0, organizationId = this.authService.getOrganizationID()) {
    this.loadingSubject.next(true);

    this.userService.findByOrganizationId(limit, offset, organizationId).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(users => {
        console.log(users);
        this.elemCount = users.length;
        this.usersSubject.next(users);
      });
  }
}
