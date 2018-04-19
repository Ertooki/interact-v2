import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EventService, UserService} from '../../services';
import {InstantErrorMatcher} from '../../utils';

@Component({
  selector: 'app-add-responsible',
  templateUrl: './add-responsible.component.html',
  styleUrls: ['./add-responsible.component.css']
})
export class AddResponsibleComponent implements OnInit {

  form: FormGroup;

  users = [];
  matcher = new InstantErrorMatcher();
  event_id;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialogRef<AddResponsibleComponent>,
              private userService: UserService,
              private eventService: EventService) {
    this.event_id = data.id;
  }

  ngOnInit() {
    this.form = new FormGroup ({
      user: new FormControl('', Validators.required),
    });
    this.form.get('user').valueChanges
      .subscribe(
        val => {
          this.userService.findByName(typeof(val) === 'object' ? val['username'] : val)
            .subscribe(
              data => {
                this.users = data;
                if (data.length === 0) {
                  this.form.get('user').setErrors({'nomatch': true});
                }
              },
              error => {
                console.log(error);
              }
            );
        }
      );
  }

  submit() {
    const {user} = this.form.value;
    console.log(user);
    if (typeof(user) !== 'object') {
      this.form.get('user').setErrors({invalid: true});
    } else {
      this.eventService.addResponsible(this.event_id, user.id)
        .subscribe(
          data => {
            console.log(data);
            this.dialog.close();
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  displayFn(user?: Object): string | undefined {
    return user ? user['username'] : undefined;
  }

}
