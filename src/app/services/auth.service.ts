import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {JwtHelper} from 'angular2-jwt';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../interfaces';

@Injectable()
export class AuthService {

  mainURL = 'http://10.10.11.24:8080/cyber_incidents/api';
  jwtHelper = new JwtHelper();
  loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  currentUser = new BehaviorSubject<User>(this.formUser());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Object> {
    const authParams = {
      email: email,
      password: password
    };
    return this.http.post<Object>(`${this.mainURL}/auth`, authParams);
  }

  signup(email: string, name: string, password: string, organizationId: string): Observable<Object> {
    const signupParams = {
      email: email,
      username: name,
      password: password,
      organizationId: organizationId
    };
    return this.http.post<Object>(`${this.mainURL}/users`, signupParams);
  }

  isAuthenticated(): boolean {
    if (!localStorage.getItem('token')) {
      return false;
    } else {
      return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
    }
  }

  formUser(): User {
    if (!localStorage.getItem('token')) {
      return null;
    } else {
      const token = this.jwtHelper.decodeToken(localStorage.getItem('token'));
      return new User(token.id, token.email, token.username, token.initials, token.role.toLowerCase(), token.organization_id);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  getRole(): string {
    if (!localStorage.getItem('token')) {
      return 'unauthorized';
    }
    const role = this.jwtHelper.decodeToken(localStorage.getItem('token')).role;
    return role.toLowerCase();
  }

  getUserID(): number {
    if (!localStorage.getItem('token')) {
      return null;
    }
    return this.jwtHelper.decodeToken(localStorage.getItem('token')).id;
  }

  getOrganizationID(): number {
    if (!localStorage.getItem('token')) {
      return null;
    }
    return this.jwtHelper.decodeToken(localStorage.getItem('token')).organization_id;
  }

  public setToken(token: string): void {
    const role = this.jwtHelper.decodeToken(token).role;
    localStorage.setItem('token', token);
    if (role.toLowerCase() !== 'inactive') {
      this.loggedIn.next(true);
      this.currentUser.next(this.formUser());
    } else {
      this.loggedIn.next(false);
      this.currentUser.next(this.formUser());
    }
  }

  public unsetToken(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUser.next(this.formUser());
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }


}
