import { FormGroup } from "@angular/forms";

export function AtLeastAnUppercaseValidator(controlName: string) {
    let reg = new RegExp(/(?=.*[A-Z])/);

    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];

        if(control.errors && !control.errors.AtLeastAnUppercaseValidator)
        {
            return;
        }

        if(control.value?.match(reg) === null) {
            control.setErrors({ no_uppercase: true })
        } else {
            control.setErrors(null);
        }
    }
}
