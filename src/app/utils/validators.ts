import {AbstractControl} from '@angular/forms';

export function passwordValidator(AC: AbstractControl) {
  const password = AC.get('pwd').value; // to get value in input tag
  const confirmPassword = AC.get('cpwd').value; // to get value in input tag
  if (password !== confirmPassword) {
    AC.get('cpwd').setErrors( {MatchPassword: true} );
  } else {
    return null;
  }
}

export function scopeValidator(AC: AbstractControl) {
  const scopeView = AC.get('scopeView').value;
  if (scopeView === 1) {
    AC.get('scopeUpdate').setValue(1);
  }
  return null;
}
