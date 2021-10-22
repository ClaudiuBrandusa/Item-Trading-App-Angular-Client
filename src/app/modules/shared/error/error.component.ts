import { Component, Input, OnInit } from '@angular/core';
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
    'pattern': (params) => `Invalid format`,
    'no-whitespace': (params) => `White spaces are not allowed`,
    'mismatch': (params) => `Is not matching`
  };

  listErrors() {
    if(this.controlName == null) return [];
    if(this.controlName.errors) {
      this.errorList = [];
      Object.keys(this.controlName.errors).map(error => {
        this.controlName.touched || this.controlName.dirty ?
        this.errorList.push(this.errorMessage[error](this.controlName?.errors[error])) : '';
      });
      return this.errorList;
    }
    else {
      return [];
    }
  }
}
