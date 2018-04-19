import {Component, OnInit, ViewChild} from '@angular/core';
import {EventDataSource} from '../../datasources';
import {MatDialog, MatPaginator, MatSelectChange} from '@angular/material';
import {AuthService, EventService, OrganizationService} from '../../services';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {AddIncidentComponent} from '../../modals';
import {User} from '../../interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-incident-table',
  templateUrl: './incident-table.component.html',
  styleUrls: ['./incident-table.component.css']
})
export class IncidentTableComponent implements OnInit {

  displayedColumns = ['id', 'organization', 'date', 'tags', 'attributeCount'];
  dataSource: EventDataSource;
  scopes = [
    {
      name: 'Приватні для користувача',
      value: 1
    },
    {
      name: 'Приватні для організації',
      value: 2
    },
    {
      name: 'Публічні',
      value: 3
    },
  ];
  organizations = [];
  user: User;
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private organizationService: OrganizationService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router) {
    this.organizationService.list()
      .subscribe(
        data => {
          this.organizations = data;
        },
        error => {
          console.log(error);
        }
      );
    this.authService.getCurrentUser()
      .subscribe(
        user => {
          this.user = user;
        },
        error => {
          console.log(error);
        }
      );
    this.filterForm = new FormGroup({
      scopeView: new FormControl(2),
      organization: new FormControl(this.authService.getOrganizationID())
    });
  }

  ngOnInit() {
    this.dataSource = new EventDataSource(this.eventService, this.authService);
    this.dataSource.loadEvents();
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadEventsPage())
      )
      .subscribe();
  }

  onOrganizationChange(event: MatSelectChange) {
    this.dataSource.loadEvents(this.paginator.pageSize, 0, this.filterForm.get('scopeView').value, event.value);
  }

  onScopeChange(event: MatSelectChange) {
    this.dataSource.loadEvents(this.paginator.pageSize, 0, event.value, this.filterForm.get('organization').value || this.authService.getOrganizationID());
  }

  loadEventsPage() {
    this.dataSource.loadEvents(this.paginator.pageSize, this.paginator.pageIndex);
  }

  showIncident(row) {
    this.router.navigate([`incidents/${row.id}`]);
  }

}
