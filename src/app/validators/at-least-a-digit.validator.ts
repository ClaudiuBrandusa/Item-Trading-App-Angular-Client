import { FormGroup } from "@angular/forms";

export function AtLeastADigitValidator(controlName: string) {
    let reg = new RegExp(/(?=.*\d)/);

    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];

        if(control.errors && !control.errors.AtLeastADigitValidator)
        {
            return;
        }

        if(control.value?.match(reg) === null) {
            control.setErrors({ no_digit: true });
        } else {
            control.setErrors(null);
        }
    }
}
