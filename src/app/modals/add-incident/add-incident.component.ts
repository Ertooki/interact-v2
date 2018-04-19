import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialogRef, MatSelectChange} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService, TagService} from '../../services';
import {scopeValidator} from '../../utils/validators';

@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.css']
})
export class AddIncidentComponent implements OnInit {

  tags = [];
  types = [
    {
      symbol: 'M',
      name: 'ШПЗ'
    },
    {
      symbol: 'P',
      name: 'Фішинг'
    },
    {
      symbol: 'NA',
      name: 'Несанкціонований доступ'
    },
    {
      symbol: 'V',
      name: 'Вразливість'
    },
    {
      symbol: 'APT',
      name: 'APT'
    },
    {
      symbol: 'Other',
      name: 'Інше'
    }];
  threats = [
    {
      level: 1,
      name: 'Низький'
    },
    {
      level: 2,
      name: 'Середній'
    },
    {
      level: 3,
      name: 'Високий'
    }
  ];
  scopes = [
    {
      name: 'Тільки я',
      value: 1
    },
    {
      name: 'Усі члени організації',
      value: 2
    },
    {
      name: 'Будь-хто',
      value: 3
    },
  ];
  options = [];

  incidentForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddIncidentComponent>,
    private tagService: TagService,
    private eventService: EventService) {}

  ngOnInit() {
    this.incidentForm = new FormGroup ({
      type: new FormControl('', Validators.required),
      threat: new FormControl('', Validators.required),
      scopeView: new FormControl('', Validators.required),
      scopeUpdate: new FormControl('', Validators.required),
      tags: new FormControl(''),
      info: new FormControl('')
    });
    this.incidentForm.get('tags').valueChanges
      .subscribe(val => {
        if (val !== '' && typeof(val) !== 'object') {
          if (val.slice(-1) === ',') {
            this.tagService.findOne(val.substr(0, val.length - 1).toLowerCase())
              .subscribe(
                data => {
                  if (data) {
                    this.tags.push(val.substr(0, val.length - 1));
                    document.getElementById('tags_input').blur();
                    document.getElementById('tags_input').focus();
                    return this.options = [];
                  }
                },
                error => {
                  console.log(error);
                }
              );
          } else {
            this.tagService.search(val.toLowerCase())
              .subscribe(
                data => {
                  return this.options = data;
                },
                error => {
                  console.log(error);
                  return this.options = [];
                });
          }
        }
      });
  }

  scopeCheck(event: MatSelectChange): void {
    const scopeUpdateCtrl = this.incidentForm.get('scopeUpdate');
    if (event.source.value === 1) {
      scopeUpdateCtrl.setValue(1);
      scopeUpdateCtrl.disable();
    } else {
      if (scopeUpdateCtrl.disabled) {
        scopeUpdateCtrl.enable();
      }
    }
  }

  addAuto(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value.name);
    this.options = [];
  }

  clear(event: MatChipInputEvent): void {
    const input = event.input;

    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  createIncident() {
    this.eventService.create(
      this.tags.join(),
      this.incidentForm.get('info').value,
      this.incidentForm.get('type').value,
      this.incidentForm.get('threat').value,
      this.incidentForm.get('scopeView').value,
      this.incidentForm.get('scopeUpdate').value)
      .subscribe(
        data => {
          console.log(data);
          this.dialog.close('Added!');
        },
        error => {
          console.log(error);
        }
      );
  }
}
