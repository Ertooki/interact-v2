import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from '../services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/auth']);
    return false;
  }
}
