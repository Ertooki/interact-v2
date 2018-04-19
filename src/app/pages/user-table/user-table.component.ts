import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDataSource} from '../../datasources';
import {MatDialog, MatPaginator, MatSelectChange, MatSlideToggleChange} from '@angular/material';
import {AuthService, OrganizationService, UserService} from '../../services';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {ChangeRoleComponent} from '../../modals';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  displayedColumns = ['id', 'email', 'username', 'organization', 'role', 'active'];
  dataSource: UserDataSource;
  roles = [
    {
      value: 2,
      name: 'Адміністратор організації'
    },
    {
      value: 3,
      name: 'Користувач'
    },
  ];
  organizations = [];
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    public dialog: MatDialog) {
    if (this.authService.getRole() === 'admin') {
      this.roles.push(
        {
          value: 1,
          name: 'Суперадмін'
        }
      );
    }
    this.organizationService.list()
      .subscribe(
        data => {
          this.organizations = data;
        },
        error => {
          console.log(error);
        }
      );
    this.filterForm = new FormGroup({
      organization: new FormControl(this.authService.getOrganizationID())
    });
  }

  ngOnInit() {
    this.dataSource = new UserDataSource(this.userService, this.authService);
    this.dataSource.filterUsersByOrganizationId();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadEventsPage())
      )
      .subscribe();
  }

  loadEventsPage() {
    this.dataSource.filterUsersByOrganizationId(this.paginator.pageSize, this.paginator.pageIndex);
  }

  changeUserState(id: number, event: MatSlideToggleChange) {
    this.userService.changeUserState(event.checked, id)
      .subscribe(
        data => {
          this.dataSource.filterUsersByOrganizationId(this.paginator.pageSize, this.paginator.pageIndex);
        },
        error => {
          console.log(error);
        }
      );
  }

  onRoleChange(id: number, event: MatSelectChange) {
    const dialogRef = this.dialog.open(ChangeRoleComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeUserRole(event.value, id)
          .subscribe(
            data => {
              this.dataSource.filterUsersByOrganizationId(this.paginator.pageSize, this.paginator.pageIndex);
            },
            error => {
              console.log(error);
            }
          );
      }
    });
  }

  onOrganizationChange(event: MatSelectChange) {
    this.dataSource.filterUsersByOrganizationId(this.paginator.pageSize, 0, event.value);
  }
}
