import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AttrTypeService} from '../../services';

@Component({
  selector: 'app-add-attr-type',
  templateUrl: './add-attr-type.component.html',
  styleUrls: ['./add-attr-type.component.css']
})
export class AddAttrTypeComponent implements OnInit {

  form: FormGroup;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddAttrTypeComponent>,
    private attrTypeService: AttrTypeService
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      name: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
    });
  }

  submit() {
    console.log(this.form.value);
    this.attrTypeService.create(this.form.value).subscribe(
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
