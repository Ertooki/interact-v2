import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from '../services';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    switch (this.authService.getRole()) {
      case 'admin':
        this.router.navigate(['/board']);
        return false;
      case 'user':
        this.router.navigate(['/incidents']);
        return false;
      case 'inactive':
        this.router.navigate(['/not-active']);
        break;
      case 'unauthorized':
        this.router.navigate(['/auth']);
        return false;
    }
  }
}
