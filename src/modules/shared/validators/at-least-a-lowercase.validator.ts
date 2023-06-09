import { FormGroup } from "@angular/forms"

export function AtLeastALowercaseValidator(controlName: string) {
  let reg = new RegExp(/(?=.*[a-z])/);

  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];

    if(control.errors && !control.errors.AtLeastALowercaseValidator)
    {
      return;
    }

    if(control.value?.match(reg) === null) {
      control.setErrors({ no_lowercase: true });
    } else {
      control.setErrors(null);
    }
  }
}
