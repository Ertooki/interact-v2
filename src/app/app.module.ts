import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRouteModule} from './app.route';
import {ActiveGuard, AdminGuard, AuthGuard, InactiveGuard, LoggedInGuard, RoleGuard, UserGuard} from './guards';
import {AttrTypeService, AuthService, EventService, OrganizationService, TagService, UserService} from './services';
import {
  AttributesTableComponent, AuthComponent, BoardComponent, IncidentTableComponent, IncidentViewComponent, NotActiveComponent,
  TagCloudComponent,
  UserTableComponent
} from './pages';
import {AddAttributeComponent, AddAttrTypeComponent, AddIncidentComponent, AddResponsibleComponent, ChangeRoleComponent} from './modals';
import {MatPaginatorIntlUa, TokenInterceptor} from './utils';
import {MatPaginatorIntl} from '@angular/material';
import {ParticlesModule} from 'angular-particle';
import {EcoFabSpeedDialModule} from '@ecodev/fab-speed-dial';


@NgModule({
  declarations: [
    AppComponent,
    AttributesTableComponent,
    AuthComponent,
    AddAttributeComponent,
    AddAttrTypeComponent,
    AddIncidentComponent,
    AddResponsibleComponent,
    BoardComponent,
    ChangeRoleComponent,
    IncidentTableComponent,
    IncidentViewComponent,
    NotActiveComponent,
    TagCloudComponent,
    UserTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EcoFabSpeedDialModule,
    MaterialModule,
    HttpClientModule,
    ParticlesModule,
    ReactiveFormsModule,
    AppRouteModule,
  ],
  providers: [
    // Guards
    ActiveGuard,
    AdminGuard,
    AuthGuard,
    InactiveGuard,
    LoggedInGuard,
    RoleGuard,
    UserGuard,
    // Services
    AttrTypeService,
    AuthService,
    EventService,
    OrganizationService,
    TagService,
    UserService,
    // Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    // Paginator
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlUa
    }
  ],
  entryComponents: [
    AddAttributeComponent,
    AddAttrTypeComponent,
    AddIncidentComponent,
    AddResponsibleComponent,
    ChangeRoleComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
