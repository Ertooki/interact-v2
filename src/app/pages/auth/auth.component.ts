import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AuthService, OrganizationService} from '../../services/index';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {passwordValidator} from '../../utils/validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  organizations: Object[];
  selectedIndex = 0;
  signupForm: FormGroup;
  signinForm: FormGroup;

  particleStyle: object = {};
  particleParams: object = {};
  particleWidth = 100;
  particleHeight = 100;

  constructor(private snackBar: MatSnackBar,
              private authService: AuthService,
              private orgService: OrganizationService,
              private router: Router) { }

  ngOnInit() {
    this.signinForm = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormControl('', Validators.required)
    });
    this.signupForm = new FormGroup ({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      pwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
      cpwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
      organization: new FormControl('', Validators.required)
    },
      passwordValidator);
    this.orgService.list()
      .subscribe(
        data => {
          this.organizations = data;
        },
        error => {
          console.log(error);
        }
      );
    this.particleStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.particleParams = {
      'particles': {
        'number': {
          'value': 180,
          'density': {
            'enable': true,
            'value_area': 800
          }
        },
        'color': {
          'value': '#ffffff'
        },
        'shape': {
          'type': 'circle',
          'stroke': {
            'width': 0,
            'color': '#000000'
          },
          'polygon': {
            'nb_sides': 5
          },
        },
        'opacity': {
          'value': 1,
          'random': true,
          'anim': {
            'enable': true,
            'speed': 1,
            'opacity_min': 0,
            'sync': false
          }
        },
        'size': {
          'value': 3,
          'random': true,
          'anim': {
            'enable': false,
            'speed': 4,
            'size_min': 0.3,
            'sync': false
          }
        },
        'line_linked': {
          'enable': false,
          'distance': 150,
          'color': '#ffffff',
          'opacity': 0.4,
          'width': 1
        },
        'move': {
          'enable': true,
          'speed': 1,
          'direction': 'none',
          'random': true,
          'straight': false,
          'out_mode': 'out',
          'bounce': false,
          'attract': {
            'enable': false,
            'rotateX': 600,
            'rotateY': 600
          }
        }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': {
          'onhover': {
            'enable': true,
            'mode': 'bubble'
          },
          'onclick': {
            'enable': true,
            'mode': 'repulse'
          },
          'resize': true
        },
        'modes': {
          'grab': {
            'distance': 400,
            'line_linked': {
              'opacity': 1
            }
          },
          'bubble': {
            'distance': 250,
            'size': 0,
            'duration': 2,
            'opacity': 0,
            'speed': 3
          },
          'repulse': {
            'distance': 400,
            'duration': 0.4
          },
          'push': {
            'particles_nb': 4
          },
          'remove': {
            'particles_nb': 2
          }
        }
      },
      'retina_detect': true
    };
  }

  logIn() {
    this.authService
      .login(this.signinForm.get('email').value, this.signinForm.get('pwd').value)
      .subscribe(
        data => {
          this.authService.setToken(data['token']);
          switch (this.authService.getRole()) {
            case 'admin':
              this.router.navigate(['/board']);
              break;
            case 'user':
              this.router.navigate(['/incidents']);
              break;
            case 'inactive':
              this.router.navigate(['/not-active']);
              break;
            case 'unauthorized':
              this.router.navigate(['/auth']);
              break;
          }
          this.snackBar.open('Ви увійшли до системи', null, {
            duration: 3000,
          });
        },
        error => {
          console.log(error);
          this.snackBar.open('Помилка серверу, зверніться до адміністратора', null, {
            duration: 3000,
          });
        }
      );
  }

  signUp() {
    this.authService
      .signup(
        this.signupForm.get('email').value,
        this.signupForm.get('name').value,
        this.signupForm.get('pwd').value,
        this.signupForm.get('organization').value)
      .subscribe(
        data => {
          this.snackBar.open('Ви успішно зареєструвалися!', null, {
            duration: 3000,
          });
          this.authService
            .login(this.signupForm.get('email').value, this.signupForm.get('pwd').value)
            .subscribe(
              data => {
                this.authService.setToken(data['token']);
                switch (this.authService.getRole()) {
                  case 'admin':
                    this.router.navigate(['/board']);
                    break;
                  case 'user':
                    this.router.navigate(['/incidents']);
                    break;
                  case 'unauthorized':
                    this.router.navigate(['/auth']);
                    break;
                }
                this.snackBar.open('Ви увійшли до системи', null, {
                  duration: 3000,
                });
              },
              error => {
                console.log(error);
                this.snackBar.open('Помилка серверу, зверніться до адміністратора', null, {
                  duration: 3000,
                });
              }
            );
        },
        error => {
          console.log(error);
        }
      );
  }

}
