import { FormGroup } from "@angular/forms";

export function AtLeastASpecialCharacterValidator(controlName: string) {
    let reg = new RegExp(/(?=.*[!@#$%^&+=*_\-+])/);
    
    return (formGroup: FormGroup) => {
        let control = formGroup.controls[controlName];
        
        if(control.errors && !control.errors.AtLeastASpecialCharacterValidator)
        {
            return;
        }

        if(control.value?.match(reg) === null) {
            control.setErrors({ no_special_character: true });
        } else {
            control.setErrors(null);
        }
    }
}