import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from '../services';

@Injectable()
export class ActiveGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    return this.authService.getRole() !== 'inactive';
  }
}
