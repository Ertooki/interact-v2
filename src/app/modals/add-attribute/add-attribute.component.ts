import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange} from '@angular/material';
import {AttrTypeService, EventService} from '../../services';
import {Observable} from 'rxjs/Observable';
import {InstantErrorMatcher} from '../../utils';

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.css']
})
export class AddAttributeComponent implements OnInit {

  attributeForm: FormGroup;
  groups = [
    {
      name: 'Індикатор компрометації',
      value: 1,
    },
    {
      name: 'Корисна інформація',
      value: 2,
    },
  ];
  types = [];
  event_id;

  matcher = new InstantErrorMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddAttributeComponent>,
    private attrTypeService: AttrTypeService,
    private eventService: EventService
  ) {
    this.event_id = data.id;
  }

  ngOnInit() {
    this.attributeForm = new FormGroup ({
      group: new FormControl('', Validators.required),
      attrType: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      description: new FormControl('')
    });
    this.attributeForm.get('attrType').valueChanges
      .subscribe(
        val => {
          this.attrTypeService.find(val, this.attributeForm.get('group').value)
            .subscribe(
              data => {
                this.types = data;
                if (data.length === 0) {
                  this.attributeForm.get('attrType').setErrors({'nomatch': true});
                }
              },
              error => {
                console.log(error);
              }
            );
        }
      );
  }

  addAttribute() {
    const {attrType, value, description} = this.attributeForm.value;
    if (typeof(attrType) !== 'object') {
      this.attributeForm.get('attrType').setErrors({invalid: true});
    } else {
      this.eventService.addAttribute(this.event_id, {attributeType: attrType.id, value: value, description: description}).subscribe(
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

  displayAttributeType(type?: Object): string | undefined {
    console.log(type);
    return type ? type['name'] : undefined;
  }

}
