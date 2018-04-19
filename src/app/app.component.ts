import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services';
import {Location} from '@angular/common';
import {MediaMatcher} from '@angular/cdk/layout';
import {Observable} from 'rxjs/Observable';
import {User} from './interfaces';
import {MatDialog, MatSidenav} from '@angular/material';
import {AddAttributeComponent, AddAttrTypeComponent, AddIncidentComponent, AddResponsibleComponent} from './modals';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  loggedIn: Observable<boolean>;
  user: User;
  activeSelector;

  mobileQuery: MediaQueryList;

  menu = [
    {
      displayName: 'Cтатистика',
      path: 'board',
      selector: 'app-board',
      icon: 'donut_small',
      active: false
    },
    {
      displayName: 'Інциденти',
      path: 'incidents',
      selector: 'app-incident-table',
      icon: 'report',
      active: false
    }
  ];
  currentComponent;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.getCurrentUser()
      .subscribe(
        user => {
          this.user = user;
          if (user) {
            if (user.role === 'admin') {
              this.menu.splice(1, 0,
                {
                  displayName: 'Типи атрибутів',
                  path: 'attributes',
                  selector: 'app-attributes-table',
                  icon: 'flag',
                  active: false
                },
                {
                  displayName: 'Теги',
                  path: 'tags',
                  selector: 'app-tag-cloud',
                  icon: 'label',
                  active: false
                });
            }
            if (user.role === 'admin' || user.role === 'manager') {
              this.menu.push({
                displayName: 'Користувачі',
                path: 'users',
                selector: 'app-user-table',
                icon: 'people',
                active: false
              });
            }
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {}


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.unsetToken();
    this.menu = [
      {
        displayName: 'Cтатистика',
        path: 'board',
        selector: 'app-board',
        icon: 'donut_small',
        active: false
      },
      {
        displayName: 'Інциденти',
        path: 'incidents',
        selector: 'app-incident-table',
        icon: 'report',
        active: false
      }
    ];
    this.router.navigate(['/auth']);
  }

  goToPage(page: string, nav: MatSidenav) {
    nav.close()
      .then(() => {
        this.router.navigate([page]);
      });
  }

  openDialog(selector: string) {
    switch (selector) {
      case 'add-incident':
        this.dialog.open(AddIncidentComponent);
        break;
      case 'add-attribute':
        this.dialog.open(AddAttributeComponent, {data: {id: this.currentComponent.id}});
        break;
      case 'add-attribute-type':
        this.dialog.open(AddAttrTypeComponent);
        break;
      case 'add-responsible':
        this.dialog.open(AddResponsibleComponent, {data: {id: this.currentComponent.id}});
        break;
    }
  }

  onActivated(component) {
    this.currentComponent = component;
    this.activeSelector =
      this.resolver.resolveComponentFactory(component.constructor).selector;
    this.menu.forEach((menu_item) => {
      menu_item.active = menu_item.selector === this.activeSelector;
    });
  }
}
