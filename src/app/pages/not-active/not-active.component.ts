import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-active',
  templateUrl: './not-active.component.html',
  styleUrls: ['./not-active.component.css']
})
export class NotActiveComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.unsetToken();
    this.router.navigate(['/auth']);
  }

}
