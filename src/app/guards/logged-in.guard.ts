import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from '../services';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.isAuthenticated()) {
      switch (this.authService.getRole()) {
        case 'admin':
          this.router.navigate(['/board']);
          return false;
        case 'user':
          this.router.navigate(['/incidents']);
          return false;
      }
    }
    return true;
  }
}
