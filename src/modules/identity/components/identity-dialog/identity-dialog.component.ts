import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-identity-dialog',
  templateUrl: './identity-dialog.component.html',
  styleUrls: ['./identity-dialog.component.css']
})
export class IdentityDialogComponent {

  @Input()
  formGroup: FormGroup;

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  submitButtonText ='';

  constructor() { }

}
