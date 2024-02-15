import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent {

  @Input()
  title: string;

  @Input()
  cancelButtonName = "Cancel";

  @Input()
  nextButtonName = "Next";

  @Input()
  hideCancelButton: boolean;

  @Input()
  hideNextButton: boolean;

  @Input()
  hideXButton: boolean;
  
  @Input()
  isNextButtonDisabled = false;
  
  @Input()
  isCancelButtonDisabled = false;

  @Output()
  onContinue = new EventEmitter();

  @Output()
  onExit = new EventEmitter();

  constructor() { }

  next() {
    this.onContinue.emit();
  }

  cancel() {
    this.onExit.emit();
  }
}
