import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActiveGuard, AdminGuard, AuthGuard, InactiveGuard, LoggedInGuard, RoleGuard} from './guards';
import {AppComponent} from './app.component';
import {
  AttributesTableComponent, AuthComponent, BoardComponent, IncidentTableComponent, IncidentViewComponent, NotActiveComponent,
  TagCloudComponent,
  UserTableComponent
} from './pages';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AppComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'auth', component: AuthComponent, canActivate: [LoggedInGuard] },
  { path: 'attributes', component: AttributesTableComponent, canActivate: [AuthGuard, ActiveGuard, AdminGuard]},
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard, ActiveGuard, AdminGuard]},
  { path: 'incidents/:id', component: IncidentViewComponent, canActivate: [AuthGuard, ActiveGuard]},
  { path: 'incidents', component: IncidentTableComponent, canActivate: [AuthGuard, ActiveGuard]},
  { path: 'not-active', component: NotActiveComponent, canActivate: [InactiveGuard]},
  { path: 'tags', component: TagCloudComponent, canActivate: [AuthGuard, ActiveGuard, AdminGuard]},
  { path: 'users', component: UserTableComponent, canActivate: [AuthGuard, ActiveGuard, AdminGuard]}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [RouterModule.forRoot(routes)]
})

export class AppRouteModule {}
