import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

  errorList: any = [];

  @Input() controlName: AbstractControl | AbstractControlDirective

  errorMessage = {
    'required': (params) => `This field is required`,
    'maxlength': (params) => `Maximum ${params.requiredLength} characters are allowed`,
    'minlength': (params) => `Minimum ${params.requiredLength} characters are required`,
    'email': (params) => 'Is not an email',
    'pattern': (params) => `Invalid format`,
    'no_whitespace': (params) => `White spaces are not allowed`,
    'mismatch': (params) => `Is not matching`,
    'no_lowercase': (params) => `Needs at least a lowercase character`,
    'no_uppercase': (params) => `Needs at least an uppercase character`,
    'no_digit': (params) => `Needs at least a digit`,
    'no_special_character': (params) => `Needs at least a special character`
  };

  listErrors() {
    if(this.controlName == null) return [];
    if(this.controlName.errors) {
      this.errorList = [];
      Object.keys(this.controlName.errors).map(error => {
        this.controlName.touched || this.controlName.dirty?
        this.errorList.push(this.errorMessage[error](this.controlName.errors[error])) : '';
      });
      return this.errorList;
    }
    else {
      return [];
    }
  }
}
